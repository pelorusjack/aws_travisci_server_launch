


# Start an AWS EC2 Server based on Successful build on Travis-CI


## deploy using the following commands

```javascript
git clone https://github.com/pelorusjack/aws_travisci_server_launch
cd aws_travisci_server_launch
```

copy the .env.sample to .env and update the values.

```
npm i -g pm2
pm2 start index.js
pm2 startup systemd
```

run the output of this command e.g. 
```bash
[PM2] Init System found: systemd
[PM2] You have to run this command as root. Execute the following command:
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v8.4.0/bin /home/ubuntu/.nvm/versions/node/v8.4.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```




