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

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PostComponent,
    AddPostComponent,
    SearchTextComponent,
    SearchResultComponent,
<<<<<<< HEAD
    PopupComponent
=======
    SafeHtmlPipe
>>>>>>> origin/main
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatIconModule,
    NgbModule,
    AuthModule.forRoot({
			domain: "dev-xf7ranoi.us.auth0.com",
			clientId: "6mFKxcpnpQiSRhW6NTBSttrDT1hICDkL",
			redirectUri: window.location.origin })


  ] ,
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
