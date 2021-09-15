export class WorkflowStatus {
  fontColor: string;

  constructor(
    public id: string,
    public label: string,
    public fillColor?: string,
    public labelBackgroundColor?: string,
    fontColor?: string
  ) {
    this.fontColor = fontColor || 'white';
  }
}
