declare module 'html2pdf.js' {
    const html2pdf: {
      (): any;
      from: (element: HTMLElement) => any;
      set: (options: any) => any;
      save: () => any;
    };
    export default html2pdf;
}