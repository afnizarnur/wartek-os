import.meta.glob('/src/apps/*/manifest.json', { eager: true });

export function buildRegistry() {
  const modules = import.meta.glob('/src/apps/*/manifest.json', { eager: true });

  const registry = {};

  for (const path in modules) {
    const manifest = modules[path].default || modules[path];

    // Extract widget name from path: /src/apps/sticky-notes/manifest.json -> sticky-notes
    const match = path.match(/\/src\/apps\/([^/]+)\//);
    if (!match) continue;

    const widgetId = match[1];

    registry[widgetId] = {
      id: manifest.id || widgetId,
      name: manifest.name,
      author: manifest.author,
      version: manifest.version,
      description: manifest.description,
      icon: manifest.icon,
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
