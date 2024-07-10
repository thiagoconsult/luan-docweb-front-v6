import { Component, ElementRef, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {

    isAdmin : any = sessionStorage.getItem('groupAdmin');
    title = `Docweb, Bem-vindo ${sessionStorage.getItem('loginUser')}`

    menus: Array<PoMenuItem> = [];


    constructor(public router: Router) {}

    ngOnInit() {
        this.initializeMenu();

    };


    initializeMenu() {

        if (this.isAdmin === 'true'){

            this.menus = [
                {
                    label: 'Home',
                    link: `/main/home/${new Date().getTime()}`,
                    icon: 'po-icon po-icon-home',
                    shortLabel: 'Home',
                },
                {
                    label: 'Dicionários',
                    link: '/main/dicionario/info',
                    icon: 'po-icon po-icon-database',
                    shortLabel: 'Dicionários',

                },
                {
                    label: 'Repositório',
                    icon: 'po-icon po-icon-document-filled',
                    shortLabel: 'Fontes',
                    link: '/main/fonte/info'
                } ,
                {
                    label: 'Análise Cruzada ',
                    icon: 'po-icon po-icon-oil-analysis',
                    shortLabel: 'Fontes',
                    link: '/main/analysis'
                } ,
                {
                    label: 'Histórico de reservas',
                    icon: 'po-icon po-icon-download',
                    shortLabel: 'Fontes',
                    link: '/main/reserv'
                } ,
                

                {
                    label: 'Categorias',
                    icon: 'po-icon po-icon-book',
                    shortLabel: 'Categorias',
                    link: '/main/category'
                },
                {
                    label: 'Usuários',
                    icon: 'po-icon po-icon-user-add',
                    shortLabel: 'Usuários',
                    link: '/main/login/users'
                },
                {
                    label: 'Histórico',
                    icon: 'po-icon po-icon-history',
                    shortLabel: 'Usuários',
                    link: '/main/fonte/hist'
                },
                {
                    label: 'Logout',
                    icon: 'po-icon po-icon-exit',
                    shortLabel: 'Logout',
                    link: '/main/login'
                }


            ]
        }else{

            this.menus = [
                {
                    label: 'Home',
                    link: `/main/home/${new Date().getTime()}`,
                    icon: 'po-icon po-icon-home',
                    shortLabel: 'Home',
                },
                {
                    label: 'Dicionários',
                    link: '/main/dicionario/info',
                    icon: 'po-icon po-icon-database',
                    shortLabel: 'Dicionários',

                },
                {
                    label: 'Repositório',
                    icon: 'po-icon po-icon-document-filled',
                    shortLabel: 'Fontes',
                    link: '/main/fonte/info'
                } ,
                {
                    label: 'Análise Cruzada ',
                    icon: 'po-icon po-icon-oil-analysis',
                    shortLabel: 'Fontes',
                    link: '/main/analysis'
                } ,
                {
                    label: 'Histórico de reservas',
                    icon: 'po-icon po-icon-download',
                    shortLabel: 'Fontes',
                    link: '/main/reserv'
                } ,

                {
                    label: 'Logout',
                    icon: 'po-icon po-icon-exit',
                    shortLabel: 'Logout',
                    link: '/main/login'
                }]

        }

      }


    exitPage(){
        this.router.navigateByUrl('/main/login')
    };




}
