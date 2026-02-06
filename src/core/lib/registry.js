import.meta.glob('/src/apps/*/manifest.json', { eager: true });
import.meta.glob('/src/apps/*/*.png', { eager: true, query: '?url', import: 'default' });
import.meta.glob('/src/apps/*/*.jpg', { eager: true, query: '?url', import: 'default' });
import.meta.glob('/src/apps/*/*.jpeg', { eager: true, query: '?url', import: 'default' });
import.meta.glob('/src/apps/*/*.svg', { eager: true, query: '?url', import: 'default' });

export function buildRegistry() {
  const modules = import.meta.glob('/src/apps/*/manifest.json', { eager: true });
  const assets = import.meta.glob('/src/apps/*/*.{png,jpg,jpeg,svg}', { eager: true, query: '?url', import: 'default' });

  const registry = {};

  for (const path in modules) {
    const manifest = modules[path].default || modules[path];

    // Extract widget name from path: /src/apps/sticky-notes/manifest.json -> sticky-notes
    const match = path.match(/\/src\/apps\/([^/]+)\//);
    if (!match) continue;

    const widgetId = match[1];

    // Resolve icon - if it's an asset path, get the actual URL
    let icon = manifest.icon;
    if (icon && icon.startsWith('asset:')) {
      const assetPath = `/src/apps/${widgetId}/${icon.slice(6)}`;
      icon = assets[assetPath] || icon;
    }

    registry[widgetId] = {
      id: manifest.id || widgetId,
      name: manifest.name,
      author: manifest.author,
      version: manifest.version,
      description: manifest.description,
      icon: icon,
      path: `/apps/${widgetId}`,
      width: manifest.width,
      height: manifest.height,
      resizable: manifest.resizable,
      defaultWidth: manifest.defaultWidth || manifest.width,
      defaultHeight: manifest.defaultHeight || manifest.height,
      tags: manifest.tags || []
    };
  }

  return registry;
}

export function getWidgetPath(widgetId) {
  return `/apps/${widgetId}`;
}
