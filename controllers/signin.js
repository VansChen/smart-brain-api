const handleSignin = (db, bcrypt) => (req, res) => { //have the function (db, bcrypt) and return another function and then run below codes
    
    const {email, password} = req.body;
    //simple validation
    if (!email || !password) {
    return res.status(400).json('incorrect form submission')
    }

    db.select ('email','hash').from('login')
      .where ('email','=',email)     //no need {} since we do not need object
      .then (data => {
      	const isValid = bcrypt.compareSync(password, data[0].hash);
      	//console.log(isValid);
        if (isValid) {
           return db.select('*').from('users') //do not forget return
            .where('email','=', email)
            .then(user => {
            	res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')	
        }
      	//console.log(data);  //here data shows the login table, which match aboove specific cretiria 
      })
      .catch(err => res.status(400).json('wrong credentials'))
	// if (req.body.email === database.users[0].email &&      
	// 	req.body.password === database.users[0].password) {
	// 	//important: now express does not know what we just send over
	//     //need to use bodyparser for being able to use request of body
	//  res.json(database.users[0]);
	//  //res.send('signing');
 // 	} else {
 // 	  res.status(400).json('error logging in');	
 // 	} 
}

module.exports = {
	handleSignin: handleSignin
}

