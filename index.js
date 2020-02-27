const utils = require('./utils.js');
const inquirer = require('inquirer');
const openpgp = require('openpgp');

// Test comment

async function init() {
    inquirer.prompt(utils.menu).then(async function(ans) {
        try {
            if(ans.pass1 !== ans.pass2){
                console.log('ERROR: Passwords do not match!');
                process.exit(1);
            }
            let keypair = await generateKeypair(ans.userId, ans.userEmail, ans.pass1);
            console.log(`Public Key Armored: \n${keypair.pub}`);
            console.log(`Private Key Armored: \n${keypair.priv}`);
            console.log(`Revoc. Certificate: \n${keypair.rev}`);
        } catch (error) {
            console.log('ERROR: init() ' + error);
            process.exit(1);
        }
    });
}

async function generateKeypair(uid, uem, pp) {
    const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
        userIds: [{ name: uid, email: uem}],
        curve: 'ed25519',
        passphrase: pp
    });
    let ret = {
        'pub': publicKeyArmored,
        'priv': privateKeyArmored,
        'rev': revocationCertificate
    };
    return ret;
}

init();