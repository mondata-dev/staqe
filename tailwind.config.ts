import type { Config } from 'tailwindcss';

// We're using tailwind.config.ts over Nuxt tailwind config because Webstorm's Tailwind support is looking for this file.

export default <Partial<Config>>{
  // Since nimiq is our main style and already provides some utility classes,
  // we only use tailwind to fill the gaps where needed and carefully select the core plugins that we use.
  // For example, we definitely do not want tailwind fonts to overwrite nimiq fonts.
  // List of core plugins: https://tailwindcss.com/docs/configuration#core-plugins
  corePlugins: [
    'alignContent',
    'alignItems',
    'alignSelf',
    'backgroundImage',
    'backgroundColor',
    'borderRadius',
    'borderColor',
    'boxShadow',
    'boxShadowColor',
    'cursor',
    'display',
    'fill',
    'flex',
    'flexBasis',
    'flexDirection',
    'flexGrow',
    'flexShrink',
    'flexWrap',
    'fontSize',
    'fontWeight',
    'gradientColorStops',
    'height',
    'inset',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'letterSpacing',
    'lineHeight',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'opacity',
    'outlineStyle',
    'outlineColor',
    'outlineOffset',
    'outlineWidth',
    'overflow',
    'padding',
    'position',
    'rotate',
    'space',
    'textAlign',
    'textColor',
    'textDecoration',
    'textTransform',
    'transform',
    'transitionDelay',
    'transitionDuration',
    'transitionProperty',
    'transitionTimingFunction',
    'visibility',
    'width',
    'zIndex',
  ],
};
