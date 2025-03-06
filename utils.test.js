const { cn } = require('./src/lib/utils');

describe('Utils', () => {
  describe('cn function', () => {
    it('should combine class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional class names', () => {
      const result = cn('class1', { class2: true, class3: false });
      expect(result).toBe('class1 class2');
    });

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });
  });
}); 