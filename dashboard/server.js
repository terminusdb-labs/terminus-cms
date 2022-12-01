
const path = require('path')

const express = require('express')
const app = express()
const port = 3000


app.use('/assets', express.static(path.join(__dirname, './dist/assets')));
app.get('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, './dist')});
});


//app.use('/', express.static('./dist'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})