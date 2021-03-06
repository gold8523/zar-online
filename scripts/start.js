const path = require('path');

const Hapi = require('@hapi/hapi');

const port = process.env.PORT || 3000;

const FILES = /\.(js|js.map|woff|woff2|svg|bmp|jpg|jpeg|gif|png|ico)(\?v=\d+\.\d+\.\d+)?$/;

const PATH = { '/': 'index.html' };

const hapi = require('@hapi/inert');

const init = async () => {
  const server = Hapi.server({ port });

  await server.register(hapi);

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: (request, h) => {
      // console.log(response.setHeader("Content-Security-Policy", "default-src 'self'"));
      if (FILES.test(request.path)) {
        return h.file(path.join(process.cwd(), 'dist', request.path));
      }

      return h.file(path.join(process.cwd(), 'dist', PATH[request.path]));
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
