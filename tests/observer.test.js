const observer = require('../observer'); // Ajusta la ruta según la estructura de tu proyecto

describe('Observer Pattern', () => {
beforeEach(() => {
    // Reiniciamos los observadores antes de cada prueba
    observer.observers = [];
});

test('Verifica que subscribe añade observers correctamente', () => {
    const mockFn = jest.fn();
    observer.subscribe(mockFn);
    expect(observer.observers).toContain(mockFn);
});

test('Verifica que se eliminen observers correctamente', () => {
    const mockFn = jest.fn();
    
    observer.subscribe(mockFn);
    expect(observer.observers).toContain(mockFn);

    observer.unsubscribe(mockFn);
    expect(observer.observers).not.toContain(mockFn);
});

test('Verifica que notify llame a todos los observer con los datos proporcionados', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const data = { message: 'test' };
    
    observer.subscribe(mockFn1);
    observer.subscribe(mockFn2);
    
    observer.notify(data);
    
    expect(mockFn1).toHaveBeenCalledWith(data);
    expect(mockFn2).toHaveBeenCalledWith(data);
    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
});
});
