Metawidget for React
--------------------

This is currently a WIP [Metawidget](https://github.com/metawidget/metawidget) port for [React](https://facebook.github.io/react/).

## Development

Once you've cloned this repository locally, run `npm install`. This will grab all of the external dependencies for this project. From time to time you may need to run this again.

### Building

`npm start` will build and run this module, and watch for any changes and automatically rebuild for you.

## Using this module

As this module has not been published to [npm](https://npmjs.org/), you will need to _link_ this module locally for development.
`npm link` in this project will allow this module to be linked from within other projects, such as the React Address Book Example.

You would then run `npm link react-metawidget` in the other project's directory to add your local version of `react-metawidget` as a dependency for the project.