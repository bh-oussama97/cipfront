import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlynumber]'
})
export class OnlynumberDirective {

  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const value = this.inputElement['value'];

    if (
      this.navigationKeys.indexOf(e.key) > -1 || 
      (e.key === 'a' && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+A, Cmd+A
      (e.key === 'c' && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+C, Cmd+C
      (e.key === 'v' && (e.ctrlKey || e.metaKey)) || // Allow: Ctrl+V, Cmd+V
      (e.key === 'x' && (e.ctrlKey || e.metaKey))    // Allow: Ctrl+X, Cmd+X
    ) {
      // let it happen, don't do anything
      return;
    }

    // Allow one decimal point
    if (e.key === '.' && value.indexOf('.') === -1) {
      return;
    }
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }


}