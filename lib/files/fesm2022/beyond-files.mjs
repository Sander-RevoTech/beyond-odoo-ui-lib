import * as i1 from '@angular/common';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, ViewChild, Output, Input, Component } from '@angular/core';
import * as i2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '@beyond/ui';
import { BydBaseComponent, isLight, getBlobImage, determineNewSize } from '@beyond/utils';
import ImageEditor from 'tui-image-editor';

class FilesAnnotationComponent extends BydBaseComponent {
    imagePath;
    saveImage$;
    savedImage = new EventEmitter();
    tuiImageEditor;
    // control
    selection = '';
    shapeSelection = '';
    colorHexa = '#000000';
    colorList = [
        '#ff0d00',
        '#ffa200',
        '#f4ff1f',
        '#34e610',
        '#147001',
        '#00cad1',
        '#0034d1',
        '#3d009e',
        '#000000',
        '#ffffff',
    ];
    objectActivated = null;
    brushSize = 10;
    isLight = isLight;
    _containerRef;
    _tuiRef;
    _canvasSize = {
        width: 0,
        height: 0,
    };
    _intoDrawing = false;
    constructor() {
        super();
        window.addEventListener('keyup', this.keyPress);
    }
    ngOnInit() {
        if (this.saveImage$) {
            this._registerSubscription(this.saveImage$.subscribe(() => {
                this.onSaveClick();
            }));
        }
    }
    ngOnDestroy() {
        window.removeEventListener('keyup', this.keyPress);
        this.tuiImageEditor.destroy();
    }
    ngAfterViewInit() {
        this._createImageEditor();
    }
    getHeight() {
        return `${this._canvasSize.height}px`;
    }
    getWidth() {
        return `${this._canvasSize.width}px`;
    }
    keyPress(event) {
        if (event.key === 'Enter') {
            this._stopDrawing();
        }
    }
    // control
    showPanel() {
        return this.selection !== '' && !this._intoDrawing;
    }
    changeSelection(newSelection) {
        this.selection = newSelection;
        this._intoDrawing = false;
        if (!this.selection) {
            this._stopDrawing();
            return;
        }
        if (this.selection === 'line') {
            this.drawing('FREE_DRAWING');
            this.changeShapeSelection('');
            return;
        }
        if (this.selection === 'shape') {
            if (!this.shapeSelection) {
                this.changeShapeSelection('line');
            }
            return;
        }
        if (this.selection === 'text') {
            this.text();
            this.changeShapeSelection('');
            return;
        }
    }
    changeShapeSelection(newSelection) {
        this.shapeSelection = newSelection;
        if (!this.shapeSelection) {
            return;
        }
        if (this.shapeSelection === 'line') {
            this.drawing('LINE_DRAWING');
            return;
        }
        this.shape(this.shapeSelection);
    }
    undo() {
        this.tuiImageEditor.discardSelection();
        this.tuiImageEditor.undo();
    }
    redo() {
        this.tuiImageEditor.discardSelection();
        this.tuiImageEditor.redo();
    }
    shape(type) {
        this._stopDrawing();
        this.tuiImageEditor.setDrawingShape(type, this._getSettings());
        this.tuiImageEditor.startDrawingMode('SHAPE');
    }
    drawing(type) {
        this._stopDrawing();
        this.tuiImageEditor.startDrawingMode(type, this._getSettings());
    }
    text() {
        this._stopDrawing();
        this.tuiImageEditor.startDrawingMode('TEXT', this._getSettings());
    }
    changeColor(color) {
        this.colorHexa = color;
        this._reflow();
    }
    changeBrushSize(size) {
        this.brushSize = size;
        this._reflow();
    }
    clear() {
        if (this.objectActivated) {
            this.tuiImageEditor.removeActiveObject();
        }
    }
    validation() {
        this.onSaveClick();
    }
    onSaveClick = async () => {
        this.requestState.asked();
        const data = this.tuiImageEditor.toDataURL({
            format: 'png',
            quality: 0.4,
        });
        const blob = await getBlobImage(data);
        this.savedImage.emit(blob);
        this.requestState.completed();
    };
    async _createImageEditor() {
        this.tuiImageEditor = new ImageEditor(this._tuiRef.nativeElement, {
            usageStatistics: false,
        });
        const crop = await this.tuiImageEditor.loadImageFromURL(this.imagePath, 'default');
        this._canvasSize = determineNewSize(crop.newHeight, crop.newWidth, this._containerRef.nativeElement.clientWidth, this._containerRef.nativeElement.clientHeight - 70);
        this.tuiImageEditor.resizeCanvasDimension({
            width: this._canvasSize.width,
            height: this._canvasSize.height,
        });
        this.tuiImageEditor.on('mousedown', () => {
            this._intoDrawing = true;
        });
        this.tuiImageEditor.on('objectActivated', (data) => {
            this.objectActivated = data;
        });
        this.tuiImageEditor.on('addText', (pos) => {
            this.tuiImageEditor.addText('TEXTE', {
                ...this._getSettings(),
                ...{ position: pos.originPosition },
            });
        });
    }
    _stopDrawing() {
        this.tuiImageEditor.stopDrawingMode();
        this.objectActivated = null;
    }
    _reflow() {
        if (this.selection === 'line') {
            this.tuiImageEditor.setBrush({
                color: this.colorHexa,
                width: this.brushSize,
            });
            return;
        }
        if (this.selection === 'shape') {
            this._stopDrawing();
            this.changeShapeSelection(this.shapeSelection);
            return;
        }
    }
    _getSettings() {
        return {
            color: this.colorHexa,
            width: this.brushSize,
            fill: 'transparent',
            stroke: this.colorHexa,
            strokeWidth: this.brushSize,
            styles: {
                fill: this.colorHexa,
                fontSize: this.brushSize * 8,
            },
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: FilesAnnotationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.15", type: FilesAnnotationComponent, isStandalone: true, selector: "byd-files-annotation", inputs: { imagePath: "imagePath", saveImage$: "saveImage$" }, outputs: { savedImage: "savedImage" }, viewQueries: [{ propertyName: "_containerRef", first: true, predicate: ["containerRef"], descendants: true }, { propertyName: "_tuiRef", first: true, predicate: ["tuiRef"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"edit\" #containerRef>\r\n  <div #tuiRef [style.height]=\"this.getHeight()\" [style.width]=\"this.getWidth()\" class=\"m-a image-container\"></div>\r\n\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <div class=\"control\">\r\n      @if (this.showPanel()) {\r\n        <div class=\"panel\">\r\n          @if (this.selection === 'line') {\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n          @if (this.selection === 'shape') {\r\n            <div class=\"space-between shape-selection\">\r\n              <div (click)=\"this.changeShapeSelection('rect')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'rect' }\">\r\n                  <mat-icon>check_box_outline_blank</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('triangle')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'triangle' }\">\r\n                  <mat-icon>change_history</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('circle')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'circle' }\">\r\n                  <mat-icon>circle</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('line')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'line' }\">\r\n                  <mat-icon>straighten</mat-icon>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n          @if (this.selection === 'text') {\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n        </div>\r\n      }\r\n\r\n      <div class=\"selection space-between\">\r\n        <div (click)=\"this.changeSelection('')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === '' }\">\r\n            <mat-icon>pan_tool</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('line')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'line' }\">\r\n            <mat-icon>draw</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('shape')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'shape' }\">\r\n            <mat-icon>interests</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('text')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'text' }\">\r\n            <mat-icon>text_fields</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.clear()\">\r\n          <div class=\"item\" [ngClass]=\"{ disabled: !this.objectActivated }\">\r\n            <mat-icon>delete</mat-icon>\r\n          </div>\r\n        </div>\r\n        <span class=\"separator\"></span>\r\n        <div (click)=\"this.undo()\">\r\n          <div class=\"item\">\r\n            <mat-icon>undo</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.redo()\">\r\n          <div class=\"item\">\r\n            <mat-icon>redo</mat-icon>\r\n          </div>\r\n        </div>\r\n        <span class=\"separator\"></span>\r\n        <div (click)=\"this.validation()\">\r\n          <div class=\"item color-success\">\r\n            <mat-icon>check-line</mat-icon>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </byd-loader>\r\n</div>\r\n\r\n<ng-template #Colors>\r\n  <div class=\"colors\">\r\n    <div class=\"space-between\">\r\n      @for (color of this.colorList; track color) {\r\n        <div class=\"col\" (click)=\"this.changeColor(color)\">\r\n          <div class=\"color\" [style.background-color]=\"color\" [ngClass]=\"{ 'is-light': this.isLight(color) }\">\r\n            @if (this.colorHexa === color) {\r\n              <mat-icon>done</mat-icon>\r\n            }\r\n          </div>\r\n        </div>\r\n      }\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n<ng-template #Range>\r\n  <div class=\"range\">\r\n    <input type=\"range\" min=\"0\" max=\"100\" onchange=\"this.changeBrushSize(event)\" />\r\n  </div>\r\n</ng-template>\r\n", styles: [".edit{position:relative;height:calc(100% - 80px);display:flex;flex-direction:column;padding-bottom:70px;background-color:var(--byd-neutral-main)}.edit .image-container{flex-direction:column;display:flex;align-items:center}.control{border-top:1px solid var(--byd-neutral-400);background-color:var(--byd-neutral-100);padding:var(--byd-space-md) var(--byd-space-lg);position:absolute;bottom:0;left:0;right:0}.control .item{border-radius:50%;padding:var(--byd-space-sm)}.control .item.selected{background-color:var(--byd-surface-brand-primary);color:var(--byd-neutral-100)}.control .item.disabled{opacity:.5}.control .selection{border:1px solid var(--byd-neutral-400);margin:auto;padding:var(--byd-space-xs);border-radius:30px;text-align:center}.control .selection .separator{border:1px solid var(--byd-neutral-400);padding:0;width:0}.control .shape-selection{margin:var(--byd-space-xs) calc(var(--byd-space-base) * 12)}.control .panel{margin-bottom:var(--byd-space-sm)}.range{border:1px solid var(--byd-neutral-400);border-radius:20px;padding:var(--byd-space-xs) var(--byd-space-sm);margin-top:var(--byd-space-xs)}.colors{text-align:center;margin:auto}.colors .color{height:24px;width:24px;border-radius:50%;margin:auto;margin-top:var(--byd-space-xs);border:1px solid var(--byd-neutral-400);color:var(--byd-neutral-100)}.colors .color.is-light{color:var(--byd-text-primary)}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: FilesAnnotationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-files-annotation', standalone: true, imports: [CommonModule, NgTemplateOutlet, LoaderComponent, MatIconModule], template: "<div class=\"edit\" #containerRef>\r\n  <div #tuiRef [style.height]=\"this.getHeight()\" [style.width]=\"this.getWidth()\" class=\"m-a image-container\"></div>\r\n\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <div class=\"control\">\r\n      @if (this.showPanel()) {\r\n        <div class=\"panel\">\r\n          @if (this.selection === 'line') {\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n          @if (this.selection === 'shape') {\r\n            <div class=\"space-between shape-selection\">\r\n              <div (click)=\"this.changeShapeSelection('rect')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'rect' }\">\r\n                  <mat-icon>check_box_outline_blank</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('triangle')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'triangle' }\">\r\n                  <mat-icon>change_history</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('circle')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'circle' }\">\r\n                  <mat-icon>circle</mat-icon>\r\n                </div>\r\n              </div>\r\n              <div (click)=\"this.changeShapeSelection('line')\">\r\n                <div class=\"item\" [ngClass]=\"{ selected: this.shapeSelection === 'line' }\">\r\n                  <mat-icon>straighten</mat-icon>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n          @if (this.selection === 'text') {\r\n            <div class=\"flex-row g-space-sm\">\r\n              <ng-template [ngTemplateOutlet]=\"Range\"></ng-template>\r\n              <ng-template [ngTemplateOutlet]=\"Colors\"></ng-template>\r\n            </div>\r\n          }\r\n        </div>\r\n      }\r\n\r\n      <div class=\"selection space-between\">\r\n        <div (click)=\"this.changeSelection('')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === '' }\">\r\n            <mat-icon>pan_tool</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('line')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'line' }\">\r\n            <mat-icon>draw</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('shape')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'shape' }\">\r\n            <mat-icon>interests</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.changeSelection('text')\">\r\n          <div class=\"item\" [ngClass]=\"{ selected: this.selection === 'text' }\">\r\n            <mat-icon>text_fields</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.clear()\">\r\n          <div class=\"item\" [ngClass]=\"{ disabled: !this.objectActivated }\">\r\n            <mat-icon>delete</mat-icon>\r\n          </div>\r\n        </div>\r\n        <span class=\"separator\"></span>\r\n        <div (click)=\"this.undo()\">\r\n          <div class=\"item\">\r\n            <mat-icon>undo</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div (click)=\"this.redo()\">\r\n          <div class=\"item\">\r\n            <mat-icon>redo</mat-icon>\r\n          </div>\r\n        </div>\r\n        <span class=\"separator\"></span>\r\n        <div (click)=\"this.validation()\">\r\n          <div class=\"item color-success\">\r\n            <mat-icon>check-line</mat-icon>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </byd-loader>\r\n</div>\r\n\r\n<ng-template #Colors>\r\n  <div class=\"colors\">\r\n    <div class=\"space-between\">\r\n      @for (color of this.colorList; track color) {\r\n        <div class=\"col\" (click)=\"this.changeColor(color)\">\r\n          <div class=\"color\" [style.background-color]=\"color\" [ngClass]=\"{ 'is-light': this.isLight(color) }\">\r\n            @if (this.colorHexa === color) {\r\n              <mat-icon>done</mat-icon>\r\n            }\r\n          </div>\r\n        </div>\r\n      }\r\n    </div>\r\n  </div>\r\n</ng-template>\r\n<ng-template #Range>\r\n  <div class=\"range\">\r\n    <input type=\"range\" min=\"0\" max=\"100\" onchange=\"this.changeBrushSize(event)\" />\r\n  </div>\r\n</ng-template>\r\n", styles: [".edit{position:relative;height:calc(100% - 80px);display:flex;flex-direction:column;padding-bottom:70px;background-color:var(--byd-neutral-main)}.edit .image-container{flex-direction:column;display:flex;align-items:center}.control{border-top:1px solid var(--byd-neutral-400);background-color:var(--byd-neutral-100);padding:var(--byd-space-md) var(--byd-space-lg);position:absolute;bottom:0;left:0;right:0}.control .item{border-radius:50%;padding:var(--byd-space-sm)}.control .item.selected{background-color:var(--byd-surface-brand-primary);color:var(--byd-neutral-100)}.control .item.disabled{opacity:.5}.control .selection{border:1px solid var(--byd-neutral-400);margin:auto;padding:var(--byd-space-xs);border-radius:30px;text-align:center}.control .selection .separator{border:1px solid var(--byd-neutral-400);padding:0;width:0}.control .shape-selection{margin:var(--byd-space-xs) calc(var(--byd-space-base) * 12)}.control .panel{margin-bottom:var(--byd-space-sm)}.range{border:1px solid var(--byd-neutral-400);border-radius:20px;padding:var(--byd-space-xs) var(--byd-space-sm);margin-top:var(--byd-space-xs)}.colors{text-align:center;margin:auto}.colors .color{height:24px;width:24px;border-radius:50%;margin:auto;margin-top:var(--byd-space-xs);border:1px solid var(--byd-neutral-400);color:var(--byd-neutral-100)}.colors .color.is-light{color:var(--byd-text-primary)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { imagePath: [{
                type: Input
            }], saveImage$: [{
                type: Input
            }], savedImage: [{
                type: Output
            }], _containerRef: [{
                type: ViewChild,
                args: ['containerRef']
            }], _tuiRef: [{
                type: ViewChild,
                args: ['tuiRef']
            }] } });

/**
 * Generated bundle index. Do not edit.
 */

export { FilesAnnotationComponent };
//# sourceMappingURL=beyond-files.mjs.map
