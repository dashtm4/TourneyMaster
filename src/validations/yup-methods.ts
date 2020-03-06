import * as Yup from 'yup';

declare module 'yup' {
  interface ArraySchema<T> {
    unique(mapper: (a: T) => string, message?: string): ArraySchema<T>;
  }
}

Yup.addMethod(Yup.array, 'unique', function(
  mapper = (a: any) => a,
  message: string = `Not have duplicates`
) {
  return this.test(
    'unique',
    message,
    list => list.length === new Set(list.map(mapper)).size
  );
});
