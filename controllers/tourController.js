import fs, { stat } from 'fs';

const tours = JSON.parse(
  fs.readFileSync(`${import.meta.dirname}/../dev-data/data/tours-simple.json`),
);


export const checkBody = (req, res, next) => {
  console.log(req.body);
  if (!(req.body.name && req.body.price)){
    return res.status(400).json({
      status: "bad request",
      message: "Missing name or price"
    })
  }
  next();
}
export const checkID = (req, res, next, val) => {
  console.log(val);
  const id = val * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

export const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

export const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

export const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTours = { id: newId, ...req.body };
  tours.push(newTours);
  fs.writeFile(
    `${import.meta.dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
        });
      }
      res.status(201).json({
        status: 'success',
        data: {
          newTours,
        },
      });
    },
  );
};

export const deleteTour = (req, res) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
};

export const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    }
  })
}