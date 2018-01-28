const express = require('express');
const bodyParser = require ('body-parser'); //import bodyparser
const bcrypt = require ('bcrypt-nodejs');
const cors = require ('cors');
const app = express();
const knex = require('knex') //Use this to connect server

const register = require('./controllers/register');
const signin = require('./controllers/signin');
// const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'van',
    password : '',
    database : 'smart-brain'
  }
});

//which will return promise, so use .then
//We do not need to use JSON since it is not sent by http
// db.select('*').from('users').then(data => {
// 	console.log(data);
// });

// const database = {
//   users: [
//     {
//       id: '123',
//       name: 'John',
//       email: 'john@gmail.com',
//       password: 'cookies',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: '124',
//       name: 'Sally',
//       email: 'sally@gmail.com',
//       password: 'bananas',
//       entries: 0,
//       joined: new Date()
//     }
//   ]
// }

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {res.send(database.users)})

//Signin becomes only one line
//app.post('/signin', (req,res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/signin', signin.handleSignin(db, bcrypt)) 
//running handleSigning with db and bcrypt, and pass these to signin.js. Also when /signin gets hit
//we pass the request and response and run function again.

// //here this does not need to be a transaciton since just checking not modifying any of the database items
// app.post('/signin', (req,res) => {
//     db.select ('email','hash').from('login')
//       .where ('email','=',req.body.email)     //no need {} since we do not need object
//       .then (data => {
//       	const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//       	//console.log(isValid);
//         if (isValid) {
//            return db.select('*').from('users') //do not forget return
//             .where('email','=', req.body.email)
//             .then(user => {
//             	res.json(user[0])
//             })
//             .catch(err => res.status(400).json('unable to get user'))
//         } else {
//           res.status(400).json('wrong credentials')	
//         }
//       	//console.log(data);  //here data shows the login table, which match aboove specific cretiria 
//       })
//       .catch(err => res.status(400).json('wrong credentials'))
// 	// if (req.body.email === database.users[0].email &&      
// 	// 	req.body.password === database.users[0].password) {
// 	// 	//important: now express does not know what we just send over
// 	//     //need to use bodyparser for being able to use request of body
// 	//  res.json(database.users[0]);
// 	//  //res.send('signing');
//  // 	} else {
//  // 	  res.status(400).json('error logging in');	
//  // 	} 
// })

//Register becomes only one line
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })    //handleRegister will get the request response so

// app.post('/register', (req, res) => {
//   const { email, name, password } = req.body;
//   const hash = bcrypt.hashSync(password);
//     db.transaction (trx => {       //create a transaction when have to do more than two things at once
//        trx.insert({
//        	hash: hash,
//        	email: email
//     })	
//      .into ('login')
//      .returning('email')
//      .then(loginEmail => {   //here loginEmail I think is the "email" from returning, which is last sentence 
//      	return trx ('users')
//      	.returning('*')
//      	.insert({
//           email: loginEmail[0],
//           name: name,
//           joined: new Date()
//      	})
//      	.then(user => {
//           res.json(user[0]);
//         })
//     })
//      .then(trx.commit)    //need to commit to send this transaction
//      .catch(trx.rollback) //in case anything fails, roll back the changes
//   // return db('users')       //users insert the user and return all the columns.     
//   //   .returning('*')   
//   //   .insert({       //here it can send register data to database (PSequel)
//   // 	email: email,
//   // 	name: name,
//   // 	joined: new Date()
//   // })
//    })
//    .catch(err => res.status(400).json('unable to register')) //here we can say the words we want instead of returning error
//    //catch errors
// })

                 //here :id means we can enter in our browser anything and
                 //will be able to grab this id through req.params property
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  //let found = false; 
  db.select('*').from('users').where({
  	id: id
  })
    .then(user => {
       if(user.length) {	
    	res.json(user);   //??
    } else {
    	res.status(400).json('Not found')
    }
   }) 
    .catch(err => res.status(400).json('error getting user'))
    // if you have weird typing, will return this.

  // database.users.forEach(user => {
  //  if (user.id === id) {
  //  	  found = true;
  //  	  return res.json(user);
  //  }
  // })
  //  if(!found){ 	
  //  	res.status(400).json('not found');
  //  }
  })

app.put('/image', (req, res) => {image.handleImage(req, res, db)}) 
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

// app.put('/image', (req, res) => {
//    const {id} = req.body;
//    db('users').where('id', '=' , id)
//    .increment('entries', 1)
//    .returning('entries')
//    .then(entries => {
//      res.json(entries[0]);  
//    })
//    .catch(err => res.status(400).json('unable to get entries'))
//   //  let found = false; 
//   //  database.users.forEach(user => {
//   //  if (user.id === id) {
//   //  	  found = true;
//   //  	  user.entries++;
//   //  	  return res.json(user.entries);
//   //  }
//   // })
//   //  if(!found){ 	
//   //  	res.status(400).json('not found');
//   //  }
// })

// //Security
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
 
// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(process.env.PORT || 3000, () => { //which can contain function that run after the listen happens 3000
  console.log(`app is running on port ${process.env.PORT}`);
})

/*
our plan:
/ --> res = this is working
/signin --> Use POST and return success/fail
/register --> Use POST and return user object
/profile/:userId --> Use GET and return user object
/image --> Use PUT and return user or count
*/