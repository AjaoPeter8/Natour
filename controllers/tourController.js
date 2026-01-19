import fs from 'fs';

const tours = JSON.parse(
  fs.readFileSync(`${import.meta.dirname}/../dev-data/data/tours-simple.json`)
);


export const getAllTours =  (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
}

export const getTour = (req, res) => {
  console.log(req.params)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }
  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })

}

export const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTours = { id: newId, ...req.body };
  tours.push(newTours);
  fs.writeFile(`${import.meta.dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        newTours
      }
    })
  });
}

export const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }
  else (res.status(204).json({
    status: "success",
    data: null
  })) 
}