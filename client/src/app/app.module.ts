import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpMethod, AuthModule } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { PostComponent, SafeHtmlPipe } from './components/post/post.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchTextComponent } from './components/search-text/search-text.component';
import { MatIconModule } from '@angular/material/icon'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { PopupComponent } from './components/popup/popup.component';
import { ColorIconComponent } from './components/color-picker/color-icon/color-icon.component';
import { ColorPickerComponent } from './components/color-picker/color-picker/color-picker.component';
import { PreviousColorsComponent } from './components/color-picker/previous-colors/previous-colors.component';
import { MatDividerModule } from "@angular/material/divider"
import { ValueSliderComponent } from './components/value-input/value-slider/value-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { HexTextboxComponent } from './components/value-input/hex-textbox/hex-textbox.component';
import { ColorTextboxComponent } from './components/color-picker/color-textbox/color-textbox.component';
import { ColorPreviewComponent } from './components/color-picker/color-preview/color-preview.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { ColorPaletteComponent } from './components/color-picker/color-palette/color-palette.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PostComponent,
    AddPostComponent,
    SearchTextComponent,
    SearchResultComponent,
    PopupComponent,
    SafeHtmlPipe,
    ColorIconComponent,
    ColorPickerComponent,
    PreviousColorsComponent,
    ValueSliderComponent,
    HexTextboxComponent,
    ColorTextboxComponent,
    ColorPreviewComponent,
    ColorSliderComponent,
    ColorPaletteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatSliderModule,
    NgbModule,
    AuthModule.forRoot({
			domain: "dev-xf7ranoi.us.auth0.com",
			clientId: "6mFKxcpnpQiSRhW6NTBSttrDT1hICDkL",
			redirectUri: window.location.origin }),
  ] ,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
