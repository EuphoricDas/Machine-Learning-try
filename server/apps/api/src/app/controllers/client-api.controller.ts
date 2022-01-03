/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CompareFacesRequestDTO, CompareFacesResultDTO, ImageSourceDTO } from '../dto/face-api';
import { MatchHeadPoseRequestDTO } from '../dto/face-api/match-head-pose-request.dto';
import { MatchHeadPoseResultDTO } from '../dto/face-api/match-head-pose-result.dto';
import { PanRecognitionRequestDTO, PanRecognitionResponseDTO } from '../dto/pan-recognition';
import { IplookupService } from '../services/iplookup.service';
import { cvApi, WorkflowRepoService } from './../services';
import { ApiTokenResponseDTO } from '../dto/api-token-request.dto';
import { ParticipantDTO, ParticipantQuery, ParticipantRequestInfoDTO } from '../dto/video-session';
import { CoordinatesDTO, GeocodingResultsDTO, IpLookupResponseDTO } from '@botaiml-videoflo/entities';

@UseGuards(JwtAuthGuard)
@Controller('clientApi')
@ApiTags('clientApi')
export class ClientApiController {
  constructor(
    private readonly workFlowRepoService: WorkflowRepoService,
    private readonly ipLookupService: IplookupService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  @ApiOperation({ operationId: 'getWsToken' })
  @UseGuards(JwtAuthGuard)
  @Post('getWsToken')
  @ApiCreatedResponse({
    type: ApiTokenResponseDTO
  })
  async getWsToken(@Body() tokenRequestInfo: ParticipantRequestInfoDTO) {
    return await this.workFlowRepoService.createWebSocketToken(
      tokenRequestInfo.sessionId,
      tokenRequestInfo.participantId
    );
  }


  @ApiOperation({ operationId: 'getGeocodeLocation' })
  @Post('getGeocodeLocation')
  @ApiCreatedResponse({
    type: GeocodingResultsDTO
  })
  async getGeocodeLocation(@Body() coords: CoordinatesDTO) {
    const url =
      'https://maps.googleapis.com/maps/api/geocode/json?' +
      `latlng=${coords.latitude},${coords.longitude}&key=${this.configService.get('googleGeoCodingKey')}`;

    const response = await this.httpService.get(url).toPromise();

    if (response.data) {
      return new GeocodingResultsDTO({
        accuracy: coords.accuracy,
        results: response.data.results
      });
    }

    return new NotFoundException('Reverse GeoCoding failed!');
  }

  @ApiOperation({ operationId: 'getCustomerIpInfo' })
  @Get('getCustomerIpInfo')
  @ApiOkResponse({ type: IpLookupResponseDTO })
  async getCustomerIpInfo(@RealIP() ip: string): Promise<IpLookupResponseDTO> {
    return await this.ipLookupService.lookup(ip);
  }

  @ApiOperation({ operationId: 'getParticipantInfo' })
  @UseGuards(JwtAuthGuard)
  @Post('getParticipantInfo')
  @ApiCreatedResponse({
    type: ParticipantDTO
  })
  async getParticipantInfo(@Req() request: any, @Body() participantQuery: ParticipantQuery) {
    const projectId = request.user.projectId;

    return await this.workFlowRepoService.getParticipantInfo(projectId, participantQuery);
  }

  @ApiOperation({ operationId: 'compareFaces' })
  @Post('compareFaces')
  @ApiOkResponse({ type: CompareFacesResultDTO })
  async compareFaces(@Body() compareFacesRequestInfo: CompareFacesRequestDTO): Promise<CompareFacesResultDTO> {
    const resp = await cvApi.compareFacesCompareFacesPost({
      compareFacesViewModel: {
        image1: await this.getImageFromSource(compareFacesRequestInfo.image1),
        image2: await this.getImageFromSource(compareFacesRequestInfo.image2)
      }
    });

    return {
      success: resp.data.success,
      isMatching: resp.data.isMatching,
      distance: resp.data.distance,
      matchingPercentage: resp.data.matchingPercentage,
      errorCode: resp.data.errorCode,
      errorMessage: resp.data.errorMessage
    };
  }

  @ApiOperation({ operationId: 'panRecognition' })
  @Post('panRecognition')
  @ApiOkResponse({ type: PanRecognitionResponseDTO })
  async panRecognition(@Body() panRecognitionInfo: PanRecognitionRequestDTO): Promise<PanRecognitionResponseDTO> {
    const resp = await cvApi.getpandetailsPanOcrPost({
      panOcrRequest: {
        image: panRecognitionInfo.image.base64Image?.split(',')[1],
        fields_to_retrieve: panRecognitionInfo.fieldsToRetrieve
      }
    });

    return {
      success: resp.data.success,
      errorCode: resp.data.errorCode,
      errorMessage: resp.data.errorMessage,
      dob: resp.data.dob?.value,
      face_image: resp.data.face_image?.value,
      father_name: resp.data.father_name?.value,
      name: resp.data.name?.value,
      pan_image: resp.data.pan_image?.value,
      pan_num: resp.data.pan_num?.value,
      signature_image: resp.data.signature_image?.value
    };
  }

  @ApiOperation({ operationId: 'matchHeadPose' })
  @Post('matchHeadPose')
  @ApiOkResponse({ type: MatchHeadPoseResultDTO })
  @ApiBody({ type: MatchHeadPoseRequestDTO })
  async matchHeadPoses(@Body() matchHeadPosesRequestInfo: MatchHeadPoseRequestDTO): Promise<MatchHeadPoseResultDTO> {
    try {
      const resp = await cvApi.matchPoseMatchPosePost({
        matchPoseRequest: {
          poseName: matchHeadPosesRequestInfo.pose,
          images: matchHeadPosesRequestInfo.images.map((img, idx) => ({
            imageid: idx + 1,
            image: img.image.startsWith('data:') ? img.image.split(',')[1] : img.image
          }))
        }
      });

      return {
        pose: matchHeadPosesRequestInfo.pose,
        response: {
          success: resp.data.success,
          errorCode: resp.data.errorCode,
          errorMessage: resp.data.errorMessage,
          results: resp.data.results.map((result) => ({
            imageId: result.image_id,
            errorCode: result.errorCode,
            errorMessage: result.errorMessage,
            result: result.result
          }))
        }
      };
    } catch (e) {
      delete e.config;
      throw new InternalServerErrorException(e);
    }
  }

  private async getImageFromSource(imageSource: ImageSourceDTO): Promise<string> {
    if (imageSource.base64Image) {
      let img = imageSource.base64Image;

      // If it is a data URL in the "data:image/*;base64,<base64data>" format, then strip the data prefix
      if (img.startsWith('data:')) {
        img = img.split(',')[1];
      }

      return img;
    }

    if (imageSource.imageUrl) {
      const response = await this.httpService.get(imageSource.imageUrl).toPromise();

      return Buffer.from(response.data, 'binary').toString('base64');
    }
  }
}
