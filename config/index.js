var config = {
        local: {
                mode: 'local',
                port: [localPort],
                secret: '[localSecret]',
                googleClientId: '[clientId]',
                googleClientSecret: '[clientSecret]',
                callbackURL: 'http://localhost/login/callback'
        },
        production: {
                mode: 'production',
                port: [productionPort],
                secret: '[productionSecret]',
                googleClientId: '[clientId]',
                googleClientSecret: '[clientSecret]',
                callbackURL: '[Your domain]/login/callback'
        }
}
module.exports = function(mode) {
        return config[mode || process.argv[2] || 'local'] || config.local;
