import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../src/icons');
const outFile = path.join(__dirname, '../src/components/Icons/AutoIcons.tsx');

function pascalCase(name) {
  return name.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase());
}

function fixSvgAttributes(svg) {
  return svg.replace(/([a-zA-Z0-9:-]+)="([^"]*)"/g, (full, attr, value) => {
    if (!attr.includes('-')) return `${attr}="${value}"`;
    return `${attr.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}="${value}"`;
  });
}

const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith('.svg'));

const symbols = files.map((file) => {
  const name = file.replace('.svg', '');
  let svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8');

  svgContent = svgContent
    .replace(/<\?xml.*?\?>/g, '')
    .replace(/<!DOCTYPE.*?>/g, '');

  const viewBoxMatch = svgContent.match(/<svg[^>]*viewBox="([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const inner =
    svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1] || svgContent;

  return { name, inner, viewBox };
});

const iconNamesType = symbols.map((s) => `"${s.name}"`).join(' | ');

let output = `import React from "react";

export type IconName = ${iconNamesType};
export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
};

export const IconsSprite = () => (
  <svg style={{ display: "none" }} xmlns="http://www.w3.org/2000/svg">
${symbols
  .map(
    (s) =>
      `    <symbol id="icon-${s.name}" viewBox="${
        s.viewBox
      }">${fixSvgAttributes(s.inner)}</symbol>`
  )
  .join('\n')}
  </svg>
);

const iconViewBoxes: Record<IconName, string> = {
${symbols.map((s) => `  "${s.name}": "${s.viewBox}"`).join(',\n')}
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => (
  <svg viewBox={iconViewBoxes[name]} {...props}>
    <use href={\`#icon-\${name}\`} />
  </svg>
);

export const iconsList = {
${symbols.map((s) => `  "${s.name}": "icon-${s.name}"`).join(',\n')}
};
`;

fs.writeFileSync(outFile, output, 'utf8');
console.log(
  'Generated icons with original viewBox and TS autocomplete:',
  symbols.length
);
