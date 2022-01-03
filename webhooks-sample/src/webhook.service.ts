import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { createHmac } from 'crypto';

@Injectable()
export class WebhookService {
  processWebhook(eventName: string, payload: any, request: Request): string {
    if (!this.isValidWebhookSignature(request)) {
      throw new UnauthorizedException();
    }

    console.log(eventName, payload);

    return 'Ok';
  }

  private isValidWebhookSignature(request: Request): boolean {
    const appId = 'e372f27d4ab4452e93550cbb650de233';
    const secretKey = '7CEDHrP1I2ya9g1p5g7meQreyaCqZdI/iptWsYaQvY8=';

    const signatureKey = `${appId}:${secretKey}`;

    const receivedSignatureValue = request.headers['videoflo-signature'];

    const rawBody = JSON.stringify(request.body);

    const generatedSignatureValue = createHmac('SHA256', signatureKey)
      .update(rawBody)
      .digest('base64');

    console.log(
      'Matching HMAC Signatures',
      receivedSignatureValue,
      generatedSignatureValue,
    );

    return receivedSignatureValue === generatedSignatureValue;
  }
}
