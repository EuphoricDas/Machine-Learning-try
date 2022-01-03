import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiConfiguration } from '../api/api-configuration';
import { TokenService } from '../services/token.service';
import { post } from '../shared/http-utils';

@Component({
  selector: 'videoflo-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isVideoSessionCreated = false;

  apiUrl = 'http://localhost:3333';

  appId = 'e372f27d4ab4452e93550cbb650de233';

  secretKey = '7CEDHrP1I2ya9g1p5g7meQreyaCqZdI/iptWsYaQvY8=';

  sessionName = 'Video KYC';

  customerPrecallChecklist = `{
    "awaitCallJoining": true,
    "awaitMessage": {
      "title": "Customer Onboarding in progress",
      "description": "Please wait for the customer onboarding to complete"
    },
    "consent": {
      "title": "Thank you for your interest in Integra Video KYC Pilot.",
      "subTitle": "Here are some instructions you need to know, before starting your video based KYC process.",
      "body": "<ol><li>Follow the instructions to regarding camera, mic and location access as they appear on the next screen.</li><li>Keep your PAN Card along with Specimen Signature (signed on a white paper) handy for the Video KYC session.</li><li>Tick the below consent checkbox to agree to our terms and click on \\"Proceed for Video KYC\\" button.</li></ol>",
      "checkboxText": "I hereby authorize Integra Micro Systems Pvt. Ltd. to conduct Video KYC and to collect and store my \\"Proof of Identity\\", \\"Proof of Address\\", \\"Specimen Signature\\" &amp; \\"Live Picture\\" during the Video KYC process for the purpose of KYC identity verification.",
      "validationErrorText": "You need to give your consent before proceeding further.",
      "footer": "You will be redirected from the current page after clicking on \\"Proceed to Video KYC\\" button to start the Video KYC session.",
      "continueButtonText": "Proceed to Video KYC"
    },
    "devicePermissions": {
      "title": "Give Permissions",
      "subTitle": "We need a few permissions before we can connect you to the video call",
      "geolocation": "Please give permission to access your location.",
      "camera": "Please give access to camera.",
      "microphone": "Please give access to microphone."
    },
    "checklist": [
      {
        "id": "ensureDocuments",
        "title": "Do you have all the documents handy?",
        "subTitle": "Make sure that:",
        "items": [
          "You have your original PAN Card with you",
          "You have put your signature on a blank white paper, it is clearly legibile and matches your signature"
        ],
        "continueButtonText": "Yes, I have them ready"
      },
      {
        "id": "ensureEnvironment",
        "title": "Are you ready for the video call?",
        "subTitle": "Ensure that:",
        "items": [
          "You are in a well lit surrounding",
          "There are no background noises or disturbance"
        ],
        "continueButtonText": "Yes, I am ready"
      },
      {
        "id": "goodInternet",
        "title": "Almost there!",
        "body": "<h3>Do you have a strong internet connection?</h3><p>Ensure you are on a stable mobile network or, use a WiFi network.</p>",
        "footer": "Upon pressing the \\"Start Video Call\\" button, you will be connected to an authorized representative for a quick video-based KYC process.",
        "continueButtonText": "Start Video Call"
      }
    ]
  }`;

  participants = [
    {
      externalParticipantId: 'agent-1',
      name: 'Agent',
      role: 'agent',
      videoLayoutSettings: { 'agent-1': 'Small', 'customer-2': 'Big' }
    },
    {
      externalParticipantId: 'customer-2',
      name: 'Customer',
      role: 'customer',
      precallChecks: null,
      videoLayoutSettings: { 'agent-1': 'Small', 'customer-2': 'Big' }
    }
  ];

  webhooks = `{
  "onParticipantConnected": "http://localhost:3000/webhooks/onParticipantConnected",
  "onParticipantDisconnected": "http://localhost:3000/webhooks/onParticipantDisconnected",
  "onWorkflowFinished": "http://localhost:3000/webhooks/onWorkflowFinished",
  "onRecordingAvailable": "http://localhost:3000/webhooks/onRecordingAvailable",
  "onRecordingError": "http://localhost:3000/webhooks/onRecordingError"
}`;

  // activities = `[
  //   {
  //     "id": "randomQuestions", "activityType": "QnA", "gatherFrom": ["customer"], "displayTo": ["agent"],
  //     "configuration": {
  //       "title": "Question/Answers",
  //       "description": "Please answer a few questions for us.",
  //       "noOfQuestionsToAsk": 3,
  //       "qnaPairs": [
  //         {
  //           "question": "What is your Father's name?", "expectedAnswer": "Krishnaiah", "allowedAttempts": 3, "speech": {
  //             "speak": "What is your Father's name?",
  //             "audioUrl": ""
  //           }
  //         },
  //         {
  //           "question": "Could you please confirm your current address?",
  //           "expectedAnswer": "#67, 7th A Cross, Attur Layout, Bangalore 560064",
  //           "allowedAttempts": 3,
  //           "speech": {
  //             "speak": "Could you please confirm your current address?",
  //             "audioUrl": ""
  //           }
  //         },
  //         {
  //           "question": "What is your Date of Birth?", "expectedAnswer": "08 Nov 1979", "allowedAttempts": 3, "speech": {
  //             "speak": "What is your Date of Birth?",
  //             "audioUrl": ""
  //           }
  //         },
  //         {
  //           "question": "Where do you work?", "expectedAnswer": "BOT AI ML", "allowedAttempts": 3, "speech": {
  //             "speak": "Where do you work?",
  //             "audioUrl": ""
  //           }
  //         }
  //       ]
  //     }
  //   },
  //   {
  //     "id": "matchHeadPoses", "activityType": "MatchHeadPoses", "gatherFrom": ["customer"], "displayTo": ["agent"],
  //     "configuration": {
  //       "title": "Liveness Detection",
  //       "description": "Please turn your head in the direction prompted",
  //       "poses": ["faceleft", "faceright", "faceup", "facedown"],
  //       "noOfPosesToCheck": 2,
  //       "noOfFramesToCheck": 5
  //     }
  //   },
  //   {
  //     "id": "faceRecognition", "activityType": "FaceRecognition", "gatherFrom": ["customer"], "displayTo": ["agent"],
  //     "configuration": {
  //       "title": "Face Recognition",
  //       "face1": {
  //         "sourceType": "Base64",
  //         "value": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIANIAhwMBIgACEQEDEQH/xAAdAAABBQEBAQEAAAAAAAAAAAAGAwQFBwgCAQAJ/9oACAEBAAAAANW8+9JwFKAfU0d2265494mePuq6yjXkXH8vLO25KffcTHPADiUZj2KCHbiz9xTrcfPGbHEVXNPe1nSrGDPjOAQ/RgczFniftWSWXRio6AqiQl4D9U6ww1MaKcQzbyPYM/gusrSif0covHOhzqCYotkmrBsxobShzpam8h6ZbiQ18R8B8C7napvg+0SD4t0DX9Zg0nZ8XWfJNONbdMdECuKL2p0Ii5vRNVVTKcS8vZxVocSyba/1bRliSQQDxctKt4+9tE5aXMB4cdlXImJslnrKvdLaIzsG2xFD46Ti4u5VU4SjLn0LWtLWUiDDsZDiEiVvVUpCy7/FKcnea9XeC8Fz55IolxtfQxnU5RGAMQgI2RJ5SWkLUUvcXzITrhwyUB7eHi56YOrE7u4VzJLpDcQPBzZ/JKTl7lS9wCmYySDGCZcQio+GQJdCFSlrhuZiX2vY5YEa8NXpPpYuTs4LzSQk1aAgiINZFxNlt23PychGapo8EqyroJQdkpS7irf0MdVPlN/f4/XYQMpyMqqgAJ9a1yx4V3CTVuJwqbqSgQ5v20PRGXdSsy/jk42HHUlvkEZ6NczKiiMa28QTVT5brOnrGRk2jtg1ZdN3LGSYPv/EABoBAAMBAQEBAAAAAAAAAAAAAAIDBAEFAAb/2gAIAQIQAAAA94mkCfeBjgHDnBHQ5CKJ7Lhlfzt0t6K5WlvN6ob6bFM53QXU6bBEwCx0uC5ql1MkojpcGO9JZJ48YzYuhz2vCfqLPt/HroCz6VLqG8xVZhmU0CsMTT//xAAaAQACAwEBAAAAAAAAAAAAAAADBAECBQAG/9oACAEDEAAAABdfo6s8Wty2lW9mlPRtivl5Et9rkuFfCHpEuTTyKoq67TcaKEZmPstHMoxGTj6zTIazbHT0ha4hcPLh5XXmBARh5HdCsRnFoVD1ZwFR89aoqaN1xd1xq3LPXB//xAAvEAACAgICAQQBAgUEAwAAAAABAgMEBREABhIHEyEiFBYyEBUjMTQIJkFRJEJD/9oACAEBAAEIAD/DXCAOEf8AXYOw47rVP83JZ710/Hfwxdv117Wx3BD6+9h0C9f/AFDTIYzZw/rd1rJOqWaOQp5OrHcoaHD/AMc3/A81zX8N752/1CxnWCaidw7NleyZF7uRsyIwLDyi0ykl0duCbzfxMdhl0R0f1Ly/VLsflg81j8/jq+UxhGj881/AnhO+b53vudXqmMlZcpnbV6zJYlt2HjJJe4HBYSTKwYcNn+wPubfglcA6S19lPOgeomT6dd8q3Xex43tGNhyeMIOt8ltVoBue53Lq9I6mbxUbLziOCSfmUylfGY2xk5+5dh/nOXvZNbl1pX+dTzn6HC2X0yjrWQfR5H1a+29jqlsEFv0xOpG7HXLCDyWVJ6ko8+n95zfXJLK4u36idmt/NubPWrB3MMjGdMWiQA8qIsXXb6L6ldzkybQYaHIt7snimD6jPfkV56nUKtWJdpgayjfP5VWA3yPH1gByelWA+klSNSdzUonOzf63WvKTzL4qzg7aKa9j3gApx11k82mkXYML/tJHccucD0DJ2kzF4xlnbo3W5c3f/PvU8NVqRgRzrGo0JmGzwnWhxpAASJT/AM8cjWixG+Bged2pCakJBSsLA8UjWTJk40VYeoY8EuzbAPPV5C3pzHLy3X92SJz0vFirUi5Y2g+JnY700fmTtk1x43b4X2W+A8ldhySAjhRl+eZOD8mnKnJa5jkdOenZF/rFIzfgw6AEv7Tz1SoTXvTO08KwtJPWQ4Kv7NGMvfyMcblTc7RjqpKvP32mpKqndK0+lNfJwThGjvZivSHk17tyAMY07qWOpou0RPvzpXoL8fnH2CmamWtRn03jVep0PA/PH/aedhrfmdAzlfmEMd21Ui5lrTY+gqQX8XaeIzy5itXDtuax7LlRj7LWZUjio461WiSWfNxSzQt42bRDPGK1eOdwZatPGL4oKtKXHXIJI+91/H8C/wA6FAK/VcQB/Yb5J8KxOQB/SFledMgP6so02yxkaRCmflzvZcwcJj+29QqdXtVUgp9aleg9mTruBkkv19XKSjHwHnY6btVsosOHLTInM9g4sW9W1RxfX4v0896PFTWxWFS12uMWOvGVukxCPq2EUfHJiFjkJzFiODrBiPXcZbpd9Mti2jP++CtHBSmFXI4y8J2Ihw01iYRnDdcho+Mz35nlQAZKBpYy5s44AO0fhZPwtCKyjeTNWR5fdOag88LfiXAdvOKyWPwgAJ45+jnnrQbuRs9TwNNoBD2HE0kNQSJ9r0M1U6WYT2G8eVoYqn25BcpyQRA2q7TOEF6JqtiSB5TGJSvJKCli4gjKDRWNCN8up507cYNMNJQtLC5eKKQzE+1KedyxssfasPlZ+t3J8n2m3am2xA1bjE3luxGkRPLtzSsI27F1bqtGm8+f717swtwjuKWJGsWZL1LJ1jPWgmDRnyB/6dvHekYsH8sdQSzlaNQgAa1Y8RBMW7tXiNXr9iXreIlxWazB5CSYgTbASIs2Usp5PxY2sSMgynSYMtFEtu70zA4eiYMdZ6xDaQV7WBwVnFEwqj+0x0k3ko4dyJvnyOdXq+5mGnAUcsk/jT87XAZevQA1a71rUwnhk8QBy84eI7tqZpSRWjSIAAiSQEJl6shA1+M/teZQsh+XDSnawzHYUhj4/DnwJbnTYB4W7aHlz/Fn13E+HVpSBPNFmYLk4ce0H5MxngAF1oqYLPc7xjaErrJkvUDNZvcGGsZy9Cpfi563aPuPj+5+Mv41yDNw2G3GGDOsiI4KqDiYFu5SrXeKJIkWOIgcuHVWcnux11WTd5tu3KN/3KkTOlrT752GZbsslcVOr4qVw2Rezj6ECRVbmWoOHTn5uNSAxvPHi78fsyDDUaTB6NScr4ofyAo+Ol1fN7l1lU88eX/mpYB73v8ASzDl9tuTygD+Grcmn9verckhdpVN6y+wuSrZafZhs4DsAfyLYfPfBlqV7lfXvm6R8CvP9iTU8nILdVgCYWp4xoOLCOX/APDsc78f9scyB3IeYRQ9cQ8ycLx7UpKVm9u1BRq7DCxDWhQE3ZYwSOSSK2uSxwzfBspFD88rn3TvlN18kUdVjLYOieLCN7Cgg8u/atKOeoJ/26gN/YfmCcKK55m65b7rfj8/LiZu1THjJJ2WCaAqLfYduSW7EN6D5tPnQmktsJZhNHH4hcarbEr9IT3euUmBiKjQMevg2yfZYc9QyP5BEOZA/c8wx+kHLVU2IiY8rT90NJDbYJ9HvwQMSeWqjAkqkD/HnCkCAnjXmk1HFjqx2J56zN5KT6a58yXn6vMYiw8ga+wG5bI9o79RiRgq45fbbHlG0K6Y5eeWgdZusrOZocqkMweOXJ1Jhvwsrc8jxUtkjcVSVhuTH49m0YYay1wCUOj85bKz1L1KSl0T1ySKNcf3bGZrC5yutnD22Hta56udpwGGx9Onksj3Gvb92THYnIMuX67bu7C7VsqCF1zJCInUt2jHISySYa0zHxXCMG/qQY+lAysVkOtBT5Hlq5FUieSWW61iw8jFCFDtRv2sZP8Ak1O/etV69JexHUMhbltSyzGAO6hOQ2Fs1U307uda3DDh83l4pBvmRb7MDZctvxkEhfR8ip1yCOTXkDF7Kec9zsFSvtKtu7PbfzlRCfqG3F9ZF17hDWJ4zWZ1aWVJTv21/GEvKcxTykVmEgINDtGaxkYgik7lXlH/AJb9j6/IWMn83wL6MVjPU4SfYs9pyBHhBPbs2nL2AC392hZVDEN4R+UcjtMB5InkxY5dp1KxBI2kZW5PKylEEEKmH3SH9pPcaOR2H1mVw2nkRiu+KhRuSyM2xwxN/wC6hQft4+CiTjStISHSRIth5NyP5JBE0zyucgzMX8qH+OOJ82DuNm/KA4o3BNzHE+B5YZjJo22YKoDk+APBxj/RXh5/8COT/C/CohWMmX93D8A6/8QAOhAAAQQABQIDBwICCgMAAAAAAQACAxEEITFBURASImFxBRMyQlKBsRSRICMkMFNicoKSoaKyg8Hh/9oACAEBAAk/AP4Ze2MmmgEBzjwLXsoBn9pLIHFHCsF7xhyggf8A5aXsZso37XdpWCxGGJ1Ic2QD7BYlk0D82vYeh/qB+p9oHSJvws83FYkU0UyJh8EY4ARcXbo0D8J6ZVonEEHI3mFI7EYB7h76Bx/5M81O2XDzMBBGx4PmP6h4fj5mlsEIPivk8BSO97I4l5JLcynEnUpwBIRz6b6I0vQo++wj3XPhnuoPHLeHKXuifkWnJ7HbtcNiEFioov8AG8Be2YL4Ye/8KRoI809ro2WXOGYoKRrIYo+8vOlHdPkEb31F3mnFg3R+6Y45UmkE+SjJURUZPoEyxSaUCKNLHPgZiAA8CiLGhor2pO7uHyPLR+wU7nHlziVPR3pRt/ZfB/SfysU5uCw0YZJWkkoT3u4tNfetUoO41moWtTUzL0UYCGSCZRO6v3ZNtKBDjVBQP7KJOyn7hzRauCi1sshkhjJPzSOqwnl8mQViFvwt+pRgN4Q8IC02WnR38DS7tN+iFdhBz8k/FHCFgqOBhb3WNXPGZ9F7N9oTXs4uAHoGrgpx/l+0oT624hN7bcG1yUyjQtZIKx0NLVDLqPlKsiyFZdCXwXyGGk372VwU6jhZ48S//A2Sioz4ZBZPmUMy0FPsi/sn2/1WFkJvOjkoXs3O6cDYTgU70G6jaCm3xSq68TDqFfa53e30KNXJKXDz7ug2KA/m4CYdp3IJIQ8Mk0bK3u00lzi2NgAs+ZUjgXG+2/8AfNYxhk4Lgng57FNp5ypWC5vhATiO2yUQ4g0VN2t3ppKxBB278rT7iefEVQcWOjP+XNAjvi95ny8300orU4ZwJ9XpucWNkJG/gLsyq92L9SSpzgfZcUjYsTjy0ljCddM6Cgn9s4aQW6ds7s3fSRFypBh3ucTHh5bJ7eDeiZ2uY4E0e5g9Duo2l4ABvUFZOIq1MxjSR3PeCaH90blYAe08MYXGQve49ryKBc1qxU0XtQy+HDOPdG9hP0m00+8hltvm0oW+CVjwd6IohP7v6M0302YbRJkmi7Y2DVx7rWFfEySXEyM7xy20MkAHOJLvO0GsBORGScXvcjb6t3Hom0GaBCwEK3AUrjWrSovIkJue6oAxW37EFSTTRv7GZ0Y2d+wWq+krEyxe8iaXGN5FmR9C6TX+7w8MrY5Hmy8BgbeayPKfrwtNyVVbndOLnF9ANF2o+28qCp1FWAToUPurvpvC/wDCbmwsflrYNoUXMDiPUL6HIfyo8K2aPzEbDknEshwz6s6CRwAA6Ad1qltanEkpiY63uDWdzs7JWIjZE4AsMb/D9qT2kjUvPbaeA8EOyN5I3SGS3WhBFIeAzNseQz6adjvwmXH2yQuy+V7VKXQvhj9zyGueSjZVA1mnkWd1dHRYh4az5Rs3hRydr3C2PkLqd9Y4VvjBuwapYgOw1mgda6ZdaLIYnH7vNdPoKAtkkRz9KVe9ezxHmjf7BHIKxQu1vyhZqyU0n0CeHOGZaDdBEA+aC+IAoqq4WwsrOOUNaHbEg3l017CnZ3AsVI5guMs2p+VrVa7i0QCBmU/Tk1aw+I/QM+M4eNxdIOS8LB4llaOkaW582mTPrcdxpAlhya93xNKlBB2BRWupQa9neXPaRYLWizaY1jGimta0NAHoEVoGG0Pnw/R2fbnXknmhwnFYZk9fWLWUbWkdgNAD0Cgjt+RBohMZGCBlENVBG6LzAyPqg5o4LiUdE/ZfK0RNPmcz107FvLhx0bdAX90Sh0kLAVKLO+idp53knlNta7K7Ta7i97vMk9foX9vB0+F0Jr7I+IJ9hxyVV5DlNRHkUFv+UNFoEVw6/wDUtem4Wn6mL8Hp9NIG6tCx+CiXNZo7cJ4L+2zmCR9lsayKF3knC9gCiRHdgbo58LK9F9co/wCSNo0UczVLfFM/6lbLyQt4+Xn/AOrwH80gbDl4DuWmipyc9CpTSN/lNF+Sz4CFDhAU6B2Kwzt8jUjStunLVvi2/wDU9Bck8zIo28k6/sEUKlJ8Y2KHZLRy3T8hsmE+iBT8lF4frdoj3PO5/wDXSeSDEQxFzZYnFj2Fxyohe8NHtb7Sib3n/wAzB+QvauGxsH1wSB1eo1C3e38r2xh4cUcQXnDh3fP29u7G2Qg0RgHxyZuIG4AWIcRFioi9zzk0PaW5cAEoEG1peZTA8c1osS6PWgR3BYrDkefcCsaw+UbD+Sh7x43dmgcujs+Ec3m0cnX6rHTwzZgPgkdG6jz2p/6TAQudG72kReInLciYAco2cO1KJfM5/c+R5LpJCdXOJzJQ+IVSzptO9RksR7vGMAZBiZDTZ27NcdpAvEONLTaIvVX9kT60nEqM+rxQUjWNHJ7W/uVcj9O4fCpCTxsFVlGhssuE4iSVuR2anXmpaB8Qb81rKM13A7O5VEHZYr3+GbpDiLeB5A6hezHNfWZikBb+zkJ43Vn3QF1/6SViGuPAY4H/AHCwrn+ZyQihHLWW77EqZ8r+XuJRQoFAXdE6/sjmE6thaNRMHaK55Q7geERbU/IC6GhTi0H4Rsm2OGm0CPUJtgb9aA56C88uEbvS9iiXE7DRZZ6aK6YAB52nE1JuuXLNONZCr8uh+ZE1Sca4RN0enPTlvRoP8sbLlfUv/8QALBEAAgIBAwMCBQQDAAAAAAAAAQIAEQMSITEEQVEiYQUQEzJxIEJygWKR0f/aAAgBAgEBPwD5BeL4MAUUK/N7ykPKCo2OuP0fUTzFFy1WNnxA8gQ9Rj8iDqcfAYf7jU66hzDkoWBC79lNReQPLCF1xISTxM2TJkP3bdhEBJ3Jho7EXH9JIE6bO6sqMdj5jqqEEnmHKg2AaY/vxb16xOpPpCmMjsQEFwdPlA32lOF013MHT5GFkT6bIQWA27w+vGDXNEGAAQftPgidQfXjJ8TErOQXyKlnYVH0kMNXE+u2riIB6VL1feZBRYJl1cggzGQMNf5TeDxMrhwHHioCQQbv8wuSNIIAE0ZLLEnmY8p0aG4jH3mJ6QD3lQtsRABsBVUIwAiaWrehqsmNhRv3ki5oC2oa4F1mjMai1A+VWV9zChWtR5lWR4i4id9NQY3IoxsJvj+4EIayZjThrlQcr/KZE1Yya3HES7HYwMw2LTUKILiEnhYEO9mAVKi/cn8oF1o/8YuwAAmhibufTaqqDGQd+ISqi4OB8l+9fzE+199tMVhzEINkbexm8JC8mM9tEwO2BMqrY4IHMKidP8NdwuTMdA5C9zMfSYvpPjVQNSkau+86rDl6bIcWVSCOD2MxlvM1t5EPqOnc3Ol+GZszK2UaMfvEC40CIKA4EK42JJUH+oSpPipjNH8TLhwdQujNiDDwZl+C9ERaqyn2eY/hPSJRcO/sT/yJ0+HGax4lUCHapY3F8xUZhcPf8xO07rP2f3Owg5MblY3ImP7BP//EAC4RAAICAQMCBAUDBQAAAAAAAAECABEDEiExBFEQMkFxE0JhYoEFIiMUM1Nykf/aAAgBAwEBPwCUOYAKhUHm4EAlc+A8PhN2lcQKx4EXpc7Cwhg6TOeUIh6PMPlhQg0RUGGz5htBhT/IIwHJ9AZjxNkcKo55M6fDiwrQW+5MP0FSjZMHFzrOmRlZgKYcVFckVW/eaGO+pY96XAHymdCAC71EyIvJAn9RiPBsTUvmvaP1GNDRjZEcCjzMq6Hdb4MuPW47qZ0Y/hYActHIx3/GXPrMIJolQoPoZ8FGSx9Zkdtzo1VwJuyqWxFDyDOqWsvuB4InxcgXiwZhT4ROP0iIpBqFAhBIgZNCqNto2NWa05j4xYb1mTCuXI1814YH0ZFYfUf9jGnYiYP3AzKNKkgmwIvV5AtDGtgVMbF1DMukzKdK7GZchRMjcGpRMD6AW5qLlXKSViPQoXcyZu7iBkolVYkxM4I2aZHBx/WZ8po4+/MN943DD7Z02QrlAvzbGFgON7jIhFqv5E8tAY255EocsI+SgAIxJYmbRuGP2xW05EP3CMeYuQLQMOZO8fMCo0izCGY1G8xvv4MaQ94atbPqIVLCjzGDDZhftG0+imois1ALUGMItTKazOnBuau8yZxbKou6F9o2Yq6vdhSDU6XNizomRGjqPoZ8NeaMGkDVwJ1XX4cYK421tX4EYs7FmO5N3L4poBtccftN+sx5smA6sORl9pj/AFXq+HdT7qI/6n1TbKVH4j58uQW+UmbEGb9oWow+UT0MX+3k/wBovywesHlPvB834g+aHzN7z//Z",
  //         "caption": "Photo in Aadhar Card",
  //         "displayTo": ["agent-1"]
  //       },
  //       "face2": {
  //         "sourceType": "Camera",
  //         "caption": "Photo from Live Stream",
  //         "capturerExternalId": "agent-1",
  //         "instructionTitle": "Capturing your photo",
  //         "instructionDescription": "Please hold your face straight and look towards the camera",
  //         "capturerInstructionTitle": "Capture Customer's Photo",
  //         "capturerInstructionDescription": "Make sure that the customer is faced towards the camera and the full-frontal face is visible"
  //       }
  //     }
  //   },
  //   {
  //     "id": "panCapture", "activityType": "PanRecognition", "gatherFrom": ["customer"], "displayTo": ["agent"],
  //     "onActivityDataGathered": "http://localhost:3000/webhooks/onActivityDataGathered",
  //     "onActivityAction": "http://localhost:3000/webhooks/onActivityAction",
  //     "configuration": {
  //       "title": "Pan Recognition",
  //       "responseRequired": true,
  //       "requiredFields":["pan_num", "name", "dob", "father_name"],
  //       "optionalFields":["face_image", "signature_image", "pan_image"],
  //       "image": {
  //         "sourceType": "Camera",
  //         "caption": "Captured Pan Card Image",
  //         "capturerExternalId": "agent-1",
  //         "instructionTitle": "Capturing your pan photo",
  //         "instructionDescription": "Please hold your pan straight and show to the camera",
  //         "capturerInstructionTitle": "Capture Customer's PAN Card Photo",
  //         "capturerInstructionDescription": "Make sure that the PAN Card is faced towards the camera, is being held in correct orientation and all the fields are visible and legible"
  //       }
  //     }
  //   }
  // ]`;

  activities = `[
    {
      "id": "matchHeadPoses", "activityType": "MatchHeadPoses", "gatherFrom": ["customer"], "displayTo": ["agent"],
      "configuration": {
        "title": "Liveness Detection",
        "description": "Please turn your head in the direction prompted",
        "poses": ["faceleft", "faceright", "faceup", "facedown"],
        "noOfPosesToCheck": 2,
        "noOfFramesToCheck": 5
      }
    }
  ]`;

  joinUrls: string[][];

  constructor(private httpClient: HttpClient, private apiConfig: ApiConfiguration, private tokenService: TokenService) {
    this.apiConfig.rootUrl = this.apiUrl;

    this.createToken();
  }

  async createToken(): Promise<void> {
    this.tokenService.token = (
      await post<{ accessToken: string }>(this.httpClient, `${this.apiUrl}/token/getToken`, null, {
        appId: this.appId,
        secretKey: this.secretKey
      })
    ).accessToken;
  }

  async createSession(): Promise<void> {
    try {
      const token = (
        await post<{ accessToken: string }>(this.httpClient, `${this.apiUrl}/token/getToken`, null, {
          appId: this.appId,
          secretKey: this.secretKey
        })
      ).accessToken;

      // this.participants[0].precallChecks = {
      //   devicePermissions: {
      //     title: 'Give Permissions',
      //     subTitle: 'We need a few permissions before we can connect you to the video call',
      //     camera: 'Please give access to camera.',
      //     microphone: 'Please give access to microphone.'
      //   }
      // };

      // this.participants[1].precallChecks = JSON.parse(this.customerPrecallChecklist);

      const body = {
        name: this.sessionName,
        participants: this.participants,
        activities: JSON.parse(this.activities),
        webhooks: JSON.parse(this.webhooks)
      };

      const newSession = await post<NewSessionInfo>(this.httpClient, `${this.apiUrl}/videoSessions/createSession`, token, body);

      this.joinUrls = newSession.participants.map((p) => [
        '/join-session',
        encodeURIComponent(
          btoa(
            JSON.stringify({
              apiUrl: this.apiUrl,
              sessionId: newSession.sessionId,
              participantId: p.participantId,
              token: token
            })
          )
        )
      ]);

      this.isVideoSessionCreated = true;
    } catch (e) {
      if (e.status === 502) {
        alert(e.error.detail);
      } else if (e.status === 400 && e.error?.detail) {
        alert(e.error.detail);
      } else if (e.message) {
        alert(e.message);
      } else if (e.error?.detail) {
        alert(e.error.detail);
      } else {
        alert(JSON.stringify(e));
      }
    }
  }
}

export class NewSessionInfo {
  sessionId: string;
  participants: NewParticipantInfo[];
}

export class NewParticipantInfo {
  participantId: string;
  externalParticipantId: string;
}
