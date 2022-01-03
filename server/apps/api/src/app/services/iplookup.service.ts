import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { networkInterfaces } from 'os';
import { IpLookupResponseDTO } from '@botaiml-videoflo/entities';

@Injectable()
export class IplookupService {
  private static readonly localIpAddresses: string[] = [];
  private static localSystemIpInfo: IpLookupResponseDTO;

  constructor(private configService: ConfigService, private httpService: HttpService) {}

  static initialize() {
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        IplookupService.localIpAddresses.push(net.address);
      }
    }
  }

  private get apiKey(): string {
    return this.configService.get<string>('ipDataApiKey');
  }

  async lookup(ip: string): Promise<IpLookupResponseDTO> {
    if (this.isLocalIp(ip)) {
      if (!IplookupService.localSystemIpInfo) {
        const localIpResponse = await this.httpService.get(`https://api.ipdata.co/?api-key=${this.apiKey}`).toPromise();

        IplookupService.localSystemIpInfo = new IpLookupResponseDTO(localIpResponse.data);
      }

      return IplookupService.localSystemIpInfo;
    }

    const response = await this.httpService.get(`https://api.ipdata.co/${ip}?api-key=${this.apiKey}`).toPromise();

    return new IpLookupResponseDTO(response.data);
  }

  private isLocalIp(ipAddress: string): boolean {
    const lookedUpIpIndex = IplookupService.localIpAddresses.findIndex((localIp) => ipAddress.indexOf(localIp) >= 0);

    return lookedUpIpIndex >= 0;
  }
}

IplookupService.initialize();
