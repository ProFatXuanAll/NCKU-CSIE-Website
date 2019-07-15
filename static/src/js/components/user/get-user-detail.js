import WebLanguageUtils from 'static/src/js/utils/language.js';
import { classAdd, classRemove, delay, } from 'static/src/js/utils/style.js';
import { host, staticHost, } from 'settings/server/config.js';
import departmentUtils from 'models/faculty/utils/department.js';
import researchGroupUtils from 'models/faculty/utils/research-group.js';
import UrlUtils from 'static/src/js/utils/url.js';
import ValidateUtils from 'models/common/utils/validate.js';
import dynamicInputBlock from 'static/src/pug/components/user/dynamic-input-block.pug';
import LanguageUtils from 'models/common/utils/language.js';
import editPageHTML from 'static/src/pug/components/user/edit-page.pug';
import editPageTextHTML from 'static/src/pug/components/user/edit-page-text.pug';
import degreeUtils from 'models/faculty/utils/degree.js';
import { async, } from 'q';

export default class GetUserDetail {
    constructor ( opt ) {
        opt = opt || {};

        if (
            !opt.profileDOM ||
            !ValidateUtils.isDomElement( opt.profileDOM ) ||
            !WebLanguageUtils.isSupportedLanguageId( opt.languageId )
        )
            throw new TypeError( 'invalid arguments' );

        this.config = {
            profileId:  opt.profileId,
            languageId: opt.languageId,
        };

        const profileQuerySelector = block => `.profile__${ block }`;
        const profileTextQuerySelector = block => `.profile__input-block--${ block } > .input-block__block > .block__content > .content__word`;
        const profileModifyQuerySelector = block => `.profile__input-block--${ block } > .input-block__block > .block__content > .content__modify`;
        this.modifyButtonQuerySelector = ( block, id ) => `.input-block__block > .block__content > .content__modify--${ block }-${ id }`;
        this.addButtonQuerySelector = block => `.profile__input-block--${ block } > .input-block__block > .block__add > .add__button`;

        this.flag = {
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: `${ host }/static/src/image/icon/tw.png`,
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: `${ host }/static/src/image/icon/tw.png`,
        };

        this.editPageText = ( i18n, content ) => {
            if ( i18n ) {
                return {
                    type:       'text',
                    languageId: LanguageUtils.supportedLanguageId,
                    content,
                    flag:       true,
                };
            }
            return {
                type:       'text',
                languageId: [ this.config.languageId, ],
                content,
                flag:       false,
            };
        };

        this.profile = {
            name: {
                classModifier: 'name',
                editPage:      this.editPageText( true, 'name' ),
            },
            officeAddress: {
                classModifier: 'office-location',
                editPage:      this.editPageText( true, 'officeAddress' ),
            },
            labName:    {
                classModifier:   'lab-name',
                editPage:      this.editPageText( true, 'labName' ),
            },
            labAddress:  {
                classModifier:   'lab-location',
                editPage:      this.editPageText( true, 'labAddress' ),
            },
            labTel:    {
                classModifier:    'lab-tel',
                editPage:      this.editPageText( false, 'labTel' ),
            },
            labWeb:     {
                classModifier: 'lab-web',
                editPage:      this.editPageText( false, 'labWeb' ),
            },
            officeTel:  {
                classModifier:  'office-tel',
                editPage:      this.editPageText( false, 'labTel' ),
            },
            email:   {
                classModifier:   'email',
                editPage:      this.editPageText( false, 'email' ),
            },
            fax:     {
                classModifier:   'fax',
                editPage:      this.editPageText( false, 'fax' ),
            },
            personalWeb:  {
                classModifier: 'personal-web',
                editPage:      this.editPageText( false, 'personalWeb' ),
            },
        };

        this.editPage = {
            title: [
                this.editPageText( true, 'title' ),
            ],
            specialty: [
                this.editPageText( true, 'specialty' ),
            ],
        };

        this.i18n = Object.freeze( {
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: {
                button: {
                    add:    'add',
                    remove: 'remove',
                    modify: 'modify',
                    cancel: 'cancel',
                    check:  'check',
                },
                topic: {
                    name:          'name',
                    title:         'title',
                    specialty:     'specialty',
                    officeAddress: 'office address',
                    officeTel:     'office tel',
                    labName:       'lab name',
                    labAddress:    'lab address',
                    labTel:        'lab tel',
                    labWeb:        'lab web',
                    email:         'email',
                    personalWeb:   'personal web',
                    fax:           'fax',
                },
                placeholder: {
                    title:     'ex. Professor',
                    specialty: 'ex. Machine Learning',
                },
                modify: 'modify your ',
                add:    'add your ',
            },
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: {
                button: {
                    add:    '新增',
                    remove: '刪除',
                    modify: '編輯',
                    cancel: '取消',
                    check:  '確認',
                },
                topic: {
                    name:          '姓名',
                    title:         '職稱',
                    specialty:     '專長領域',
                    officeAddress: '辦公室位置',
                    officeTel:     '辦公室電話',
                    labName:       '實驗室名稱',
                    labAddress:    '實驗室位置',
                    labTel:        '實驗室電話',
                    labWeb:        '實驗室網站',
                    email:         'email',
                    personalWeb:   '個人網站',
                    fax:           '傳真',
                },
                placeholder: {
                    title:     'ex. 教授',
                    specialty: 'ex. 機器學習',
                },
                modify: '變更您的',
                add:    '新增您的',
            },
        } );

        this.DOM = {
            block: {
                title:      opt.profileDOM.querySelector( profileQuerySelector( 'title' ) ),
                specialty:  opt.profileDOM.querySelector( profileQuerySelector( 'specialty' ), ),
                education:  opt.educationDOM,
                experience: opt.experienceDOM,
                editPage:   opt.editPageDOM,
            },
        };

        Object.keys( this.profile ).map( ( key ) => {
            this.profile[ key ].DOM = {};
            this.profile[ key ].DOM.text = opt.profileDOM.querySelector( profileTextQuerySelector( this.profile[ key ].classModifier ) );
            this.profile[ key ].DOM.modifier = opt.profileDOM.querySelector( profileModifyQuerySelector( this.profile[ key ].classModifier ) );
        } );
    }

    async setEditPageWindow ( key ) {
        classRemove( this.DOM.block.editPage, 'content__edit-page--hidden' );
        this.DOM.block.editPage.innerHTML = '';
        this.DOM.block.editPage.innerHTML += editPageHTML( {
            cancel: this.i18n[ this.config.languageId ].button.cancel,
            check:  this.i18n[ this.config.languageId ].button.check,
            topic:  `${ this.i18n[ this.config.languageId ].modify }${ this.i18n[ this.config.languageId ].topic[ key ] }`,
        } );
        return;
    }

    closeEditPageWindow () {
        classAdd( this.DOM.block.editPage, 'content__edit-page--hidden' );
    }

    setEditPageWindowContent ( info ) {
        try {
            const data = {
                info,
                button:   {
                    remove: this.i18n[ this.config.languageId ].button.remove,
                    modify: this.i18n[ this.config.languageId ].button.modify,
                    add:    this.i18n[ this.config.languageId ].button.add,
                },
            };
            data.info.DOM.innerHTML += dynamicInputBlock( {
                data,
            } );
        }
        catch ( err ) {
            console.error( err );
        }
    }

    async setEditPageItems ( info, buttonType ) {
        await this.setEditPageWindow( info.modifier );
        const editPage = {
            content: this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__content' ),
            check:   this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__button > .button__item--check' ),
            cancel:  this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__button > .button__item--cancel' ),
        };
        const content = {
            title:     languageId => info.res[ languageId ].title[ info.index ].title,
            specialty: languageId => info.res[ languageId ].specialty[ info.index ].specialty,
        };

        this.editPage[ info.modifier ].forEach( ( editPageItem ) => {
            editPageItem.languageId.forEach( ( languageId ) => {
                editPage.content.innerHTML += editPageTextHTML( {
                    flag:       ( editPageItem.flag ) ? this.flag[ languageId ] : null,
                    content:    content[ info.modifier ]( languageId ),
                    name:    `${ info.modifier }_${ languageId }_${ info.res[ languageId ][ info.modifier ][ info.index ].id }`,
                } );
            } );
        } );
        editPage.cancel.addEventListener( 'click', () => {
            this.closeEditPageWindow();
        } );
        editPage.check.addEventListener( 'click', () => {
            this.closeEditPageWindow();
        } );
    }

    async setEditPageInput ( modifier, id ) {
        const res = {
            [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'zh-TW' ) ),
            [ LanguageUtils.getLanguageId( 'en-US' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'en-US' ) ),
        };

        const addButtonDOM = this.addButtonQuerySelector( modifier );
        console.log( addButtonDOM );
        addButtonDOM.addEventListener( 'click', async () => {

        } );

        res[ this.config.languageId ][ modifier ].forEach( ( resModifier, index ) => {
            const modifyButtonDOM = this.DOM.block[ modifier ].querySelector( this.modifyButtonQuerySelector( modifier, resModifier[ id ] ) );

            modifyButtonDOM.addEventListener( 'click', async () => {
                this.setEditPageItems( {
                    index,
                    modifier,
                    id,
                    res,
                }, 'modify' );
            } );
        } );
    }

    queryApi ( lang ) {
        return `${ host }/api/faculty/facultyWithId/${ this.config.profileId }?languageId=${ lang }`;
    }

    async fetchData ( lang ) {
        try {
            const res = await fetch( this.queryApi( lang ) );

            if ( !res.ok )
                throw new Error( 'No faculty found' );

            return res.json();
        }
        catch ( err ) {
            throw err;
        }
    }

    async setData () {
        const res = await this.fetchData( this.config.languageId );

        Object.keys( this.profile ).map( ( key ) => {
            this.profile[ key ].DOM.text.innerHTML = res.profile[ key ];
            this.profile[ key ].DOM.modifier.addEventListener( 'click', async () => {
                await this.setEditPageWindow( key );

                const data = {
                    [ LanguageUtils.getLanguageId( 'zh-TW' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'zh-TW' ) ),
                    [ LanguageUtils.getLanguageId( 'en-US' ) ]: await this.fetchData( LanguageUtils.getLanguageId( 'en-US' ) ),
                };

                const editPageContent = this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__content' );
                const editPageCheck = this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__button > .button__item--check' );
                const editPageCancel = this.DOM.block.editPage.querySelector( '.edit-page__window > .window__from > .from__button > .button__item--cancel' );
                this.profile[ key ].editPage.languageId.forEach( ( languageId ) => {
                    editPageContent.innerHTML += editPageTextHTML( {
                        flag:       ( this.profile[ key ].editPage.flag ) ? this.flag[ languageId ] : null,
                        content:    data[ languageId ].profile[ key ],
                        name:    `profile_${ key }_${ languageId }`,
                    } );
                } );
                editPageCancel.addEventListener( 'click', () => {
                    this.closeEditPageWindow();
                } );
                editPageCheck.addEventListener( 'click', () => {
                    this.closeEditPageWindow();
                } );
            } );
        } );

        await this.renderTitleInputBlock( res.title );
        await this.renderSpecialtyInputBlock( res.specialty );
        await this.renderEducationInputBlock( res.education );
        await this.renderExperienceInputBlock( res.experience );

        await this.setEditPageInput( 'title', 'titleId' );
        await this.setEditPageInput( 'specialty', 'specialtyId' );
    }

    async renderTitleInputBlock ( res ) {
        try {
            this.DOM.block.title.innerHTML = '';
            res.forEach( ( res, index ) => {
                this.setEditPageWindowContent( {
                    modifier: 'title',
                    id:       res.titleId,
                    index,
                    content:  res.title,
                    topic:    this.i18n[ this.config.languageId ].topic.title,
                    DOM:      this.DOM.block.title,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderSpecialtyInputBlock ( res ) {
        try {
            this.DOM.block.specialty.innerHTML = '';
            res.forEach( ( res, index ) => {
                this.setEditPageWindowContent( {
                    modifier: 'specialty',
                    id:       res.specialtyId,
                    index,
                    content:  res.specialty,
                    topic:    this.i18n[ this.config.languageId ].topic.specialty,
                    DOM:      this.DOM.block.specialty,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderEducationInputBlock ( res ) {
        try {
            this.DOM.block.education.innerHTML = '';
            res.forEach( ( res, index ) => {
                this.setEditPageWindowContent( {
                    modifier: 'education',
                    id:       res.educationId,
                    index,
                    content:  `${ res.school } ${ res.major } ${ degreeUtils.i18n[ this.config.languageId ][ degreeUtils.map[ res.degree ] ] }`,
                    topic:    '',
                    DOM:      this.DOM.block.education,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async renderExperienceInputBlock ( res ) {
        try {
            this.DOM.block.experience.innerHTML = '';
            res.forEach( ( res, index ) => {
                this.setEditPageWindowContent( {
                    modifier: 'experience',
                    id:       res.experienceId,
                    index,
                    content:  `${ res.organization } ${ res.department } ${ res.title }`,
                    topic:    '',
                    DOM:      this.DOM.block.experience,
                } );
            } );
        }
        catch ( err ) {
            throw err;
        }
    }

    async exec () {
        console.log( this.fetchData( this.config.languageId ) );
        await this.setData();
    }
}
