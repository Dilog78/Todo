yarn install

yarn start
http://localhost:5000

api:

Post Method
/registration
Body: email, password
response { user }

/login
Body: email, password
response { token, email }

/create
Body: title, description, priority
header: token
response { title, description, priority, status, user \_id, createdAt, updatedAt }

Get Method
header: token
/getnotes
/getnotes/completed -> only completed notes
response [{note},{note}, ...]

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
Body: title, description, priority
response {note}
