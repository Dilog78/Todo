

npm install

npm run start
http://localhost:5000

api:

Post Method
/registration
Body:   email, password
response { user }

/login
Body:   email, password
response { token: token, notes: [] }

/create
Body:   title, description, priority
header: token
response { note }

Get Method
header: token
/getnotes
/getnotes?sort=title
/getnotes?sort=data
/getnotes?sort=datarev
/getnotes?sort=priority
response [{note},{note}, ...]

Delete Method
/delete/:id
header: token

Put Method
/update/:id
header: token
Body:   title, description, priority
response {note}




