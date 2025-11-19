// declaration.d.ts

// Cho phép TypeScript nhận diện các file CSS, SCSS, v.v. là các module hợp lệ

declare module '*.css' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const content: any; 
  export default content;
}

declare module '*.scss' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}