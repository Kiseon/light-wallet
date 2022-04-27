const express = require('express');
const app = express();
const fs = require('fs');
const lightwallet = require('eth-lightwallet');
const port = 8889;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
    console.log(`server is listening on port : ${port}`);
})

app.post('/newMnemonic', async(req, res) => {
    let mnemonic;

    try {
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic});
    } catch (err) {
        console.log(err);
    }
})

app.post('/newWallet', async(req, res) => {
    let password = req.body.password;
    let mnemonic = req.body.mnemonic;

    console.log(password);
    console.log(mnemonic);

    try {
        lightwallet.keystore.createVault({
            password: password,
            seedPhrase: mnemonic,
            hdPathString: "m/0'/0'/0'"
        }, function(err, ks) {
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    ks.generateNewAddress(pwDerivedKey, 1)

                    let address = (ks.getAddresses()).toString();
                    let keystore = ks.serialize();

                    fs.writeFile('wallet.json', keystore, function(err, address) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json({code: true, message: 'success'});
                        }
                    })
                    // res.json({keystore: keystore, address: address});
            })
        })
    } catch (exception) {
        console.log("New Wallet ===>>" + exception);
    }
})