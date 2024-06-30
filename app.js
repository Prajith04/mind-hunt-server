const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, ()=> {
            console.log('listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
app.post('/submit-answers', (req, res) => {
  const answers = req.body;

  // Initialize the individual aspect totals
  const aspectTotals = {
    'E': 0,
    'I': 0,
    'S': 0,
    'N': 0,
    'T': 0,
    'F': 0,
    'J': 0,
    'P': 0,
  };

  // Define the columns and corresponding questions
  const columns = [
    [1, 5, 9, 13, 17, 21, 25, 29, 33, 37],
    [2, 6, 10, 14, 18, 22, 26, 30, 34, 38],
    [3, 7, 11, 15, 19, 23, 27, 31, 35, 39],
    [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
  ];

  // Sum the answers for each aspect
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    column.forEach(questionNumber => {
      // Adjust scoring based on the new system
      const answer = parseInt(answers[questionNumber - 1], 10);

      if (questionNumber <= 20) {
        // Scoring for the first 20 questions
        if (answer === 0) {
          if (i === 0) aspectTotals['I'] += 2;
          if (i === 1) aspectTotals['N'] += 2;
          if (i === 2) aspectTotals['T'] += 2;
          if (i === 3) aspectTotals['J'] += 2;
        } else if (answer === 1) {
          if (i === 0) aspectTotals['I'] += 1;
          if (i === 1) aspectTotals['N'] += 1;
          if (i === 2) aspectTotals['T'] += 1;
          if (i === 3) aspectTotals['J'] += 1;
        } else if (answer === 3) {
          if (i === 0) aspectTotals['E'] += 1;
          if (i === 1) aspectTotals['S'] += 1;
          if (i === 2) aspectTotals['F'] += 1;
          if (i === 3) aspectTotals['P'] += 1;
        } else if (answer === 4) {
          if (i === 0) aspectTotals['E'] += 2;
          if (i === 1) aspectTotals['S'] += 2;
          if (i === 2) aspectTotals['F'] += 2;
          if (i === 3) aspectTotals['P'] += 2;
        }
      } else {
        // Scoring for the next 20 questions
        if (answer === 0) {
          if (i === 0) aspectTotals['E'] += 2;
          if (i === 1) aspectTotals['S'] += 2;
          if (i === 2) aspectTotals['F'] += 2;
          if (i === 3) aspectTotals['P'] += 2;
        } else if (answer === 1) {
          if (i === 0) aspectTotals['E'] += 1;
          if (i === 1) aspectTotals['S'] += 1;
          if (i === 2) aspectTotals['F'] += 1;
          if (i === 3) aspectTotals['P'] += 1;
        } else if (answer === 3) {
          if (i === 0) aspectTotals['I'] += 1;
          if (i === 1) aspectTotals['N'] += 1;
          if (i === 2) aspectTotals['T'] += 1;
          if (i === 3) aspectTotals['J'] += 1;
        } else if (answer === 4) {
          if (i === 0) aspectTotals['I'] += 2;
          if (i === 1) aspectTotals['N'] += 2;
          if (i === 2) aspectTotals['T'] += 2;
          if (i === 3) aspectTotals['J'] += 2;
        }
      }
    });
  }

  // Determine the MBTI type
  const mbtiType = `${aspectTotals['E'] >= aspectTotals['I'] ? 'E' : 'I'}${aspectTotals['S'] >= aspectTotals['N'] ? 'S' : 'N'}${aspectTotals['F'] >= aspectTotals['T'] ? 'F' : 'T'}${aspectTotals['P'] >= aspectTotals['J'] ? 'P' : 'J'}`;

  res.json({ mbtiType, aspectTotals });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
