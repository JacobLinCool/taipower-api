# Taipower API

A Simple API for Getting Taipower Plants Data.

To reduce the server load of the Taipower's server.

Related: [Taipower Dashboard](https://github.com/JacobLinCool/taipower-dashboard)

## Features

- ⚡️ Fast
  - The data are cached every 5 minutes from the origin server.
  - The average response time is around 300 ms.
- 🚦 CORS
  - The API can be accessed from any domain.
- 📬 WebSocket
  - Connect once, continuously receive.
  - Data are pushed to the client every minute.
- 🔐 Secure
  - HTTPS and WSS are supported.
- 📖 Open Source
  - Feel free to fork and deploy your own.

## Endpoints

### JSON API

```md
https://taipower-api.jacob.workers.dev/
```

### WebSocket API

```md
wss://taipower-api.jacob.workers.dev/ws
```

## License

MIT License, see [LICENSE](./LICENSE)

## Contributing

All contributions are welcome.
