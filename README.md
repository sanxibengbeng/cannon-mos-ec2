## 介绍
针对游戏 https://github.com/DiscreteTom/CannonVsMosquito 的单机版服务端接口实现

## 运行程序
### linux 平台运行

1. 安装 nodejs 及相关工具
```
    sudo yum install nodejs
    sudo npm install forever -g
    sudo npm install cross-env -g
```

2. 启动应用程序
``` 
npm start 
```

3. 查看运行状态
``` 
forever list 
```

4. 重启
``` 
forever restartall 
```

## 访问并测试游戏
如果是单机运行可以访问：
http://127.0.0.1:8080/?serverUrl=ws://127.0.0.1:8080/wss

如果是在EC2上运行，请将ip替换为相应的公有ip