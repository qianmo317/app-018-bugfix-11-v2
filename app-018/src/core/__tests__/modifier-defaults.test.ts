// 变光配件默认尺寸与覆盖范围（修复：切换配件后宽高恒等、默认尺寸与配件不符）
import { describe, it, expect } from 'vitest';
import { MODIFIER_INFO } from '../../types';
import { defaultModifierDims, newLamp } from '../factory';
import { lampCoverage } from '../coverage';

describe('配件默认尺寸（面板下拉与工厂同源）', () => {
  it('每种配件的标准尺寸宽高可取且为正数', () => {
    for (const type of ['softbox', 'umbrella', 'beauty', 'bare', 'flag'] as const) {
      const d = defaultModifierDims(type);
      expect(d.w).toBe(MODIFIER_INFO[type].defaultW);
      expect(d.h).toBe(MODIFIER_INFO[type].defaultH);
      expect(d.w).toBeGreaterThan(0);
      expect(d.h).toBeGreaterThan(0);
    }
  });

  it('柔光箱默认 0.6×0.9（矩形，宽高不同）', () => {
    expect(defaultModifierDims('softbox')).toEqual({ w: 0.6, h: 0.9 });
  });

  it('雷达罩默认 φ0.55、标准罩(裸灯)默认 φ0.2', () => {
    expect(defaultModifierDims('beauty')).toEqual({ w: 0.55, h: 0.55 });
    expect(defaultModifierDims('bare')).toEqual({ w: 0.2, h: 0.2 });
  });

  it('切换配件后光斑宽高与配件宽高一一对应（矩形柔光箱）', () => {
    const lamp = newLamp(0, 0, { role: 'key' });
    lamp.modifier = { type: 'softbox', ...defaultModifierDims('softbox') };
    const cov = lampCoverage(lamp, 2);
    expect(cov.spot.w).not.toBeCloseTo(cov.spot.h, 6);
    expect(cov.spot.w - lamp.modifier.w).toBeCloseTo(cov.spot.h - lamp.modifier.h, 9); // 发散增量相同
    expect(cov.uniform.w).toBeCloseTo(cov.spot.w * 0.6, 9);
    expect(cov.uniform.h).toBeCloseTo(cov.spot.h * 0.6, 9);
  });

  it('圆形配件光斑宽高相等', () => {
    const lamp = newLamp(0, 0, { role: 'key' });
    lamp.modifier = { type: 'beauty', ...defaultModifierDims('beauty') };
    const cov = lampCoverage(lamp, 3);
    expect(cov.spot.w).toBeCloseTo(cov.spot.h, 9);
  });
});
