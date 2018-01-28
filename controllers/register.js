const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
   
  //simple validation
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }

  const hash = bcrypt.hashSync(password);
    db.transaction (trx => {       //create a transaction when have to do more than two things at once
       trx.insert({
       	hash: hash,
       	email: email
    })	
     .into ('login')
     .returning('email')
     .then(loginEmail => {   //here loginEmail I think is the "email" from returning, which is last sentence 
     	return trx ('users')
     	.returning('*')
     	.insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
     	})
     	.then(user => {
          res.json(user[0]);
        })
    })
     .then(trx.commit)    //need to commit to send this transaction
     .catch(trx.rollback) //in case anything fails, roll back the changes
  // return db('users')       //users insert the user and return all the columns.     
  //   .returning('*')   
  //   .insert({       //here it can send register data to database (PSequel)
  // 	email: email,
  // 	name: name,
  // 	joined: new Date()
  // })
   })
   .catch(err => res.status(400).json('unable to register')) //here we can say the words we want instead of returning error
   //catch errors
}

module.exports = {
  handleRegister: handleRegister
};

