canhit = require("../../server/logic/canhit")

test('canhit self', () => {
    expect(canhit(1, 1, 10, 1, 1)).toBe(true);
});

test('canhit self', () => {
    expect(canhit(1, 1, -10, 1, 1)).toBe(true);
});

test('canhit lineX', () => {
    expect(canhit(-4, -5, 0, 3, -5)).toBe(true);
});

test('canhit lineY', () => {
    expect(canhit(-4, -5, 90, -4, 3)).toBe(true);
});

test('canhit in line 45', () => {
    expect(canhit(-4, -5, 45, -2, -3)).toBe(true);
});

test('canhit in line 135', () => {
    expect(canhit(-4, -5, 135, -6, -3)).toBe(true);
});

test('cannot hit in line 135 ,target 45', () => {
    expect(canhit(-4, -5, 135, -2, -3)).toBe(false);
});

test('can hit ', () => {
    expect(canhit(5, -4, 108.0539855950312, 4, -1)).toBe(true);
});