# Videoflo Api Server

- Install the dependencies

```
npm install
```

- Start the api server

```
npx nx serve api
```

- Create .env file

```
touch .env
#Copy paste the env detials in .env.sample file
```

- Preload database with these sql commands
  - Add User details
  ```
  INSERT INTO public."user" (email,"name","mobileNo",username,"password","userRole","mostRecentlyUsedProjectId","accountId") VALUES
  ('system@videoflo.com','System','777797997','system','nI/XDrNVccTEG03iCRt5bDGEEBuGaDmbUfsliMVOfjgW9A2NIrtxJq2K8KW93rX6/ovBgOtBW3vs/MMqk3d0BA==','1',NULL,NULL)
  ,('admin@videoflo.com','Administrator','6767688699','superadmin','AuLY6sx1HXJrqi8j1Fb1O3ksgSOOHcyU/9wtDeVxqcN2bj4Gk1B/dxL7d+JU1PU2RqQ6NCDWxhHEo3+1u2mifw==','1',NULL,NULL)
  ,('bindujadas@botaiml.com','User','7795602319','bindujadas@botaiml.com','QIa9muUjeTmLE72MZXvB7tH1qQqTdtkIwQGKPztAwjM9Ozoah4eJ57byRt0sdwKkdBZ08l49ZejlF8jQPDClVQ==','1',2,1);
  ```
  - Add account details
  ```
  INSERT INTO public.account ("name") VALUES
  ('User');
  ```
  - Add Project details
  ```
  INSERT INTO public.project ("name",description,roles,"appId","secretKey","accountId") VALUES
  ('VideoKYC','To have kyc through video call','[{"name": "Agent", "callUISettings": {"chat": true, "footer": false, "toolbar": true, "autoPublish": true, "toolbarButtons": {"exit": true, "audio": true, "video": true, "fullScreen": true, "screenShare": true, "layoutSpeaking": true}}, "minNoOfParticipants": 1}, {"name": "Customer", "callUISettings": {"chat": true, "footer": false, "toolbar": true, "autoPublish": true, "toolbarButtons": {"exit": false, "audio": true, "video": true, "fullScreen": true, "screenShare": false, "layoutSpeaking": false}}, "minNoOfParticipants": 1}]','2f3cccf7-0bff-461a-9a80-9a5c4bc90e54','5hT7li2oqnPW2hGeyizTegTvoVy/oUMnLiGy+9tUBig=',1);
  ```
