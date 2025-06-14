# Hierarchical display of data React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation

git clone https://github.com/DamirTesnjak/HierarchyWithD3/tree/main

Then run in the terminal:

> npm install

to install necessary libraries.

## Usage

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### App flow

This app displays the RAW data. The RAW data has the following structure:

Example:

```
{
      Hierarchy: [
        {
          Q3: [
            {
              Jul: 113.4,
            },
            {
              Aug: 46.4,
            },
            {
              Sep: 42.7,
            },
          ],
        },
        {
          Q4: [
            {
              Oct: 115.5,
            },
            {
              Nov: 24.8,
            },
            {
              Dec: [
                {
                  "01": 115.5,
                },
                {
                  "02": 24.8,
                },
                {
                  "03": [
                    {
                      "01:00": 115.5,
                    },
                    {
                      "02:00": 24.8,
                    },
                    {
                      "03:00": 97.2,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
```

When using this app, you can edit rows via toolbar (buttons: `Skip`, `Invert`), or by right-clicking on a data row to open the context menu.

From the context menu, for each row you can:

- Skip the record

- Invert the value of the record

- Change font style: bold, italic

- Change font color

- Change font size

### Note:

- When changing the font color or size, you must click the appropriate buttons in the context menu to apply the changes.

- Inverting a value will change the font color to red. After that, it won't be possible to change the color, since negative values must stand out (my own artistic license 😄). Otherwise, custom coloring will be displayed.

- If all subset values of a parent are inverted, the parent value will automatically be inverted and its color changed to red.

- Changing the display (invert, skip) from the context menu may take longer, since the code must check parent values and update them if necessary. The processing time depends on how deeply nested the affected data is. "For approximately 13,000 records, processing can take 3–4 seconds if all records are being processed and the action is triggered from the main parent."

- The display is scrollable

## The app was tested on Windoes machine

Browser: Firefox 139.0.4
