# Aion Coordinates Helper

A web application to help Aion MMORPG players find and copy resource gathering coordinates.

## Features

- **Race Selection**: Choose between Asmodian and Elyos
- **Skill Selection**: Pick Aethertapping or Essencetapping
- **Level Filtering**: Filter resources based on your skill level (shows resources within 40 levels)
- **Map Organization**: Resources organized by game maps
- **Coordinate Conversion**: Automatically converts from newer to older coordinate format
- **Chunk Splitting**: Coordinates split into chunks for game input limitations
- **Easy Copying**: Copy chunks with one click or use textareas for manual copying
- **Multi-language Support**: English, Russian, German, French, Spanish, Polish
- **Preferences Saved**: Race and skill level saved in local storage

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Coordinate Sources

Resource coordinates are based on community data from:
- [Энергокинез Асмодиане](https://forum.euroaion.com/topic/2091-%D0%BA%D0%B0%D1%87%D0%B0%D0%B5%D0%BC-%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7-%D0%B0%D1%81%D0%BC%D1%8B/)
- [Энергокинез Элийцы](https://forum.euroaion.com/topic/2142-%D0%BA%D0%B0%D1%87%D0%B0%D0%B5%D0%BC-%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7-%D0%BD%D1%8F%D1%85%D0%B8-%D1%8D%D0%BB%D0%B8%D0%B9%D1%86%D1%8B/)
- [Эфирокинез Асмодиане](https://forum.euroaion.com/topic/2076-%D0%BA%D0%B0%D1%87%D0%B0%D0%B5%D0%BC-%D1%8D%D1%84%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7-%D0%B0%D1%81%D0%BC%D1%8B/)
- [Эфирокинез Элийцы](https://forum.euroaion.com/topic/2079-%D0%BA%D0%B0%D1%87%D0%B0%D0%B5%D0%BC-%D1%8D%D1%84%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7-%D1%8D%D0%BB%D0%B8%D0%B9%D1%86%D1%8B-%D0%BD%D1%8F%D1%85%D0%B8/)

## Related Projects

- [Aion Experience Calculator](https://aioncalculators.github.io/ExpCalc/)
- [Coordinate Reformatter](https://codepen.io/u3c/pen/MWPrPPm)

## License

MIT
