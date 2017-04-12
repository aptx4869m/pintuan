import {NgModule, ModuleWithProviders} from '@angular/core';

import {
  MdRippleModule,
  RtlModule,
  ObserveContentModule,
  PortalModule,
  OverlayModule,
  A11yModule,
  CompatibilityModule,
} from '@angular/material';

import {MdButtonToggleModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdCheckboxModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdCardModule} from '@angular/material';
import {MdIconModule} from '@angular/material';
import {MdInputModule} from '@angular/material';
import {MdSnackBarModule} from '@angular/material';
import {PlatformModule} from '@angular/material';
import {StyleModule} from '@angular/material';

const MATERIAL_MODULES = [
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdRippleModule,
  PortalModule,
  RtlModule,
  StyleModule,
  A11yModule,
  PlatformModule,
  CompatibilityModule,
  ObserveContentModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class MyMaterialModule {}
