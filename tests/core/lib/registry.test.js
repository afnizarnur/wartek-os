// Mock import.meta.glob
const mockGlob = {
  '/src/apps/template/manifest.json': {
    default: {
      id: 'template',
      name: 'Widget Template',
      author: 'Your Name',
      version: '1.0.0',
      description: 'Template widget',
      icon: 'data:image/svg+xml,<svg></svg>',
      width: 400,
      height: 500,
      resizable: true,
      defaultWidth: 400,
      defaultHeight: 500,
      tags: ['template']
    }
  },
  '/src/apps/sticky-notes/manifest.json': {
    default: {
      id: 'sticky-notes',
      name: 'Sticky Notes',
      author: 'Sarah',
      version: '1.0.0',
      description: 'Yellow sticky notes',
      icon: 'data:image/svg+xml,<svg></svg>',
      width: 400,
      height: 500,
      resizable: true,
      defaultWidth: 400,
      defaultHeight: 500,
      tags: ['productivity']
    }
  }
};

// Inline the registry logic to test it
function buildRegistryFromGlob(globResult) {
  const registry = {};
  for (const path in globResult) {
    const manifest = globResult[path].default;
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

describe('Registry', () => {
  it('builds registry from manifest data', () => {
    const registry = buildRegistryFromGlob(mockGlob);
    expect(registry['template']).toBeDefined();
    expect(registry['sticky-notes']).toBeDefined();
  });

  it('includes manifest data for each widget', () => {
    const registry = buildRegistryFromGlob(mockGlob);
    expect(registry['template'].name).toBe('Widget Template');
    expect(registry['template'].author).toBe('Your Name');
    expect(registry['sticky-notes'].name).toBe('Sticky Notes');
  });

  it('provides path to widget entry point', () => {
    const registry = buildRegistryFromGlob(mockGlob);
    expect(registry['template'].path).toContain('template');
    expect(registry['sticky-notes'].path).toContain('sticky-notes');
  });
});
