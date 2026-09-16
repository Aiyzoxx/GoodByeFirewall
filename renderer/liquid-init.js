document.addEventListener('DOMContentLoaded', () => {
  if (window.QuickLiquid && window.QuickLiquid.LiquidGlassEngine) {
    document.querySelectorAll('.glass-surface, .liquid-glass-pane').forEach((card) => {
      try {
        if (card.classList.contains('hero-stage')) return;

        const engine = new window.QuickLiquid.LiquidGlassEngine(card, {
          material: 'regular',
          refractionStrength: 22,
          bezelWidth: 28,
          thickness: 20,
          chromaticAberration: 0.2,
          dynamicLighting: true,
          hoverLighting: true,
          borderRadius: 20,
          quality: 'high',
          elevation: 1.1
        });

        engine.enableLiquidPress({ scale: 0.98, squish: 0.02 });
        card.style.overflow = 'visible';
      } catch (err) {
        console.warn('LiquidGlassEngine fallback:', err);
      }
    });
  }
});
