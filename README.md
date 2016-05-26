# Ali [dot] MD [slash]
Simple Node.js Url Shortener Service for [ali.md/](http://ali.md/)

# Setup on openshift servers
```bash
rhc app-create --app alidotmd https://raw.githubusercontent.com/icflorescu/openshift-cartridge-nodejs/master/metadata/manifest.yml --env NODE_VERSION_URL=https://semver.io/node/resolve/6 NPM_VERSION_URL=https://semver.io/npm/resolve/3 BABEL_CACHE_PATH=\$DATA_DIR/babel.cache.json AliMD_HOME=\$DATA_DIR/alimd.db AliMD_HOST=\$NODE_IP AliMD_PORT=\$NODE_PORT DEBUG=1db,1utill,alimd:* --from-code https://github.com/AliMD/ali.md.git
```
