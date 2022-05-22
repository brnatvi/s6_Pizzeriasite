const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*regex const*/
const regex={
    email:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    nom_prenom: /^[a-zA-Z\-]+$/
};

class Connect {

    disconnectUser(session, res) {
        if (session!==undefined){
            session.destroy();
            res.status(200).send({messageSuccess : 'Success'})
        }else res.status(500).send({messageError : "Impossible de vous déconnecter."});
    }

    signIn(User, req, res) {
        User.getUserByEmail(req.body.email).then(response => {
            if (response === undefined) throw "L'email ou le mot de passe est incorrecte.";
            else return response;
        }).then(async user => {
            const isValidPass = await Connect.comparePassword(req.body.pw ,user.pw);
            if (isValidPass) return user;
            else throw "L'email ou le mot de passe est incorrecte.";
        }).then(user =>{
            Connect.createSession(User, req, user);
            res.status(200).send({messageSuccess : 'Vous êtes bien connecté.'});
        }).catch(err => {
            if (!(typeof err === 'string' || err instanceof String)) err='Email or password is incorrect.';
            res.status(500).send({messageError : err});
        });
    }

    signUp(User, req, res) {
        if(! regex.nom_prenom.test(req.body.nom)){
            res.status(409).send({messageError : 'Votre nom doit contenir uniquement des caractères alphanumérique.'});
        }else if(! regex.nom_prenom.test(req.body.prenom)){
            res.status(409).send({messageError : 'Votre prénom doit contenir uniquement des caractères alphanumérique.'});
        }else if(! regex.email.test(req.body.email)){
            res.status(409).send({messageError : 'Votre email est invalide.'});
        }else if(req.body.pw.length<8){
            res.status(409).send({messageError : 'Votre mot de passe doit contenir au moins 8 caractères.'});
        }else{
            User.getNbrUserByEmail(req.body.email).then(res => {
                if (parseInt(res.rows[0].count) === 0) return res;
                else throw "Cette adresse électronique est déjà utilisé.";
            }).then(async () => {
                const hash = await Connect.hashPassword(req.body.pw);
                if (hash) return hash;
                else throw "Impossible de créer votre compte.";
            }).then(hash=>{
                req.body.pw = hash;
                try{
                    User.addUser(req, res).then(() => {
                        Connect.createSession(User, req);
                        console.log(JSON.stringify(req.session.user));
                        res.status(200).send({messageSuccess: 'Votre compte à bien été créé.'});
                    })
                }catch (error) {
                    console.log(error)
                }
            }).catch(err => {
                if (!(typeof err === 'string' || err instanceof String)) err="Veillez saisir correctement vos informations.";
                res.status(500).send({messageError : err});
            });
        }
    }

    updateProfile(User, req, res){
        let user_req=User.getUserByEmail(req.session.user.email).then(response => {
            if (response === undefined) throw "L'email ou le mot de passe est incorrecte.";
            else return response;
        })
        user_req.then(async user => {
            const isValidPass = await Connect.comparePassword(req.body.userPasswordSetCurrent ,user.pw);
            if (isValidPass) return user;
            else throw "Le mot de passe courant est incorrecte.";
        }).then(user=>{
            try{
                if(req.body.userEmailSet && regex.email.test(req.body.userEmailSet)){
                    let user_info ={id:user.id, email: req.body.userEmailSet}
                    User.getNbrUserByEmail(user_info.email).then(user_nbr => {
                        if (user_nbr !== undefined && user_nbr.rows[0].count==="0"){
                            try{
                                User.updateMail(user_info).then(()=>{
                                    req.session.user.email=user_info.email
                                    req.session.save( function(err) {})
                                })
                            }catch(error){
                                console.log(error)
                            }
                        }else throw "L'email est déjà utilisé.";
                    }).catch(()=>{
                        res.status(401).send({messageError : "Impossible de mettre à jour l'email."});
                    })
                }
            }catch (error) {console.log(error)}

            if (req.body.userPasswordSet && req.body.userPasswordSet.length >= 8) {
                user_req.then(async user => {
                    const hash = await Connect.hashPassword(req.body.userPasswordSet);
                    if (hash) return {hashU: hash, userU: user};
                    else throw "Impossible de créer votre compte.";
                }).then(response=>{
                    let ps_res={id:response.userU.id ,pw:response.hashU};
                    User.updatePassword(ps_res).catch(()=>{
                        res.status(500).send({messageError : "Impossible de mettre à jour le mot de passe."});
                    })
                })
            }
            if (User.constructor.name==="Livreur"){
                if (req.body.userAdressSet) {
                    user_req.then(user=>{
                        let ps_res = {id: user.id, address: req.body.userAdressSet};
                        User.updateAddress(ps_res).then(() => {
                            req.session.user.address = ps_res.address
                            req.session.save(function (err) {
                            })
                        }).catch(() => {
                            res.status(500).send({messageError: "Impossible de mettre à jour l'adresse."});
                        })
                    })
                }
                if (req.body.userPhoneSet){
                    user_req.then(user=>{
                        let ps_res={id:user.id ,mobile:req.body.userPhoneSet};
                        User.updateMobile(ps_res).then(()=>{
                            req.session.user.mobile=ps_res.mobile
                            req.session.save( function(err) {})
                        }).catch(()=>{
                            res.status(500).send({messageError : "Impossible de mettre à jour le numéro de téléphone."});
                        })
                    })
                }
            }
            res.status(200).send({messageSuccess: 'Vos informations ont bien été misent à jour.'});
        }).catch(err => {
            if (!(typeof err === 'string' || err instanceof String)) err="Veillez saisir correctement vos informations.";
            res.status(500).send({messageError : err});
        });

    }

    static async comparePassword(password, hash){
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    static async hashPassword(password, saltRounds = 10) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    static createSession(User, req, logIn){
        let user=(logIn!==undefined)?logIn:req.body;
        if (User.constructor.name==="Livreur"){
            req.session.user={
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                tokenAuth: "Bearer "+jwt.sign(
                    { email: user.email },
                    "VERYSECRETTOKENSESSION",
                    { expiresIn: '24h' }
                )
            }
        }else{
            req.session.user={
                nom: user.nom,
                prenom: user.prenom,
                address: user.address,
                mobile: user.mobile,
                email: user.email,
                cartItem: {
                    price: 0,
                    idQuantity: {/*id: {size : quantity}*/},
                    menu: [/*{{menu} : quantity}*/],
                    custom: [/*{{menu} : quantity}*/]
                },
                tokenAuth: "Bearer "+jwt.sign(
                    { email: user.email },
                    "VERYSECRETTOKENSESSION",
                    { expiresIn: '24h' }
                )
            }
        }
    }

}

module.exports = new Connect();