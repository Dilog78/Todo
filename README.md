

npm install

npm run start
http://localhost:5000

api:

Post Method
/create
Body:   title: string, description: string, priority: number
response {}

Get Method
/all
/all?sort=title
/all?sort=data
/all?sort=datarev
/all?sort=priority
response [{},{}, ...]

Delete Method
/delete/:id

Put Method
/update/:id
Body:   title: string, description: string, priority: number
response {}




