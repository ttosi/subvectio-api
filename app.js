const express = require('express');
// const bodyParser = require('body-parser');
const app = express();

const delivery = require('./routes/delivery');

app.use(express.static('./build'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.json());

app.use('/api/delivery', delivery);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
