// registry/index.js
// Import all 16 unified components
import * as SectionBlock  from './components/SectionBlock/SectionBlock.jsx';
import * as FlexRow       from './components/FlexRow/FlexRow.jsx';
import * as FlexColumn    from './components/FlexColumn/FlexColumn.jsx';
import * as ResponsiveGrid from './components/ResponsiveGrid/ResponsiveGrid.jsx';
import * as TextHeading   from './components/TextHeading/TextHeading.jsx';
import * as ImageMedia    from './components/ImageMedia/ImageMedia.jsx';
import * as Button        from './components/Button/Button.jsx';
import * as Navbar        from './components/Navbar/Navbar.jsx';
import * as HeroBanner    from './components/HeroBanner/HeroBanner.jsx';
import * as ContentCard   from './components/ContentCard/ContentCard.jsx';
import * as SplitFeature  from './components/SplitFeature/SplitFeature.jsx';
import * as Footer        from './components/Footer/Footer.jsx';
import * as FormInput     from './components/FormInput/FormInput.jsx';
import * as TextareaBox   from './components/TextareaBox/TextareaBox.jsx';
import * as Accordion     from './components/Accordion/Accordion.jsx';
import * as ModalDialog   from './components/ModalDialog/ModalDialog.jsx';

const ALL_COMPONENTS = [
  SectionBlock,
  FlexRow,
  FlexColumn,
  ResponsiveGrid,
  TextHeading,
  ImageMedia,
  Button,
  Navbar,
  HeroBanner,
  ContentCard,
  SplitFeature,
  Footer,
  FormInput,
  TextareaBox,
  Accordion,
  ModalDialog,
];

/** Flat map: type → definition config object */
export const REGISTRY = Object.fromEntries(
  ALL_COMPONENTS.map(c => [c.config.type, c.config])
);

/** Flat map: type → visual preview renderer function */
export const RENDERERS = Object.fromEntries(
  ALL_COMPONENTS.map(c => [c.config.type, c.Renderer])
);

/** Grouped list for left catalog sidebar rendering */
export const GROUPS = ALL_COMPONENTS.reduce((acc, c) => {
  const def = c.config;
  if (!acc[def.group]) acc[def.group] = [];
  acc[def.group].push(def);
  return acc;
}, {});

/** Catalog group metadata (ordering and display labels) */
export const GROUP_METADATA = [
  { id: 'Layout Components', label: 'Layout' },
  { id: 'Content Primitives', label: 'Content' },
  { id: 'Form Components', label: 'Interactive' },
];

/** Lookup helper */
export const getDefinition = (type) => REGISTRY[type] ?? null;

