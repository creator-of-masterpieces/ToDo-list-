import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewitemConstructor} from "./Item";

export class ItemPresenter {
    protected itemTemplate: HTMLTemplateElement;
    protected formTemplate: HTMLTemplateElement;
    protected todoForm: IForm;
    protected todoEditForm: IForm;

    constructor(
        protected model: IToDoModel,
        protected formConstructor: IFormConstructor,
        protected viewPageContainer: IPage,
        protected viewItemConstructor: IViewitemConstructor,
    ) {
        this.itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;
        this.formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement;
    }
    init() {
        this.todoForm = new this.formConstructor(this.formTemplate);
        this.todoForm.setHandler(this.handleSubmitForm.bind(this));
        this.viewPageContainer.formContainer = this.todoEditForm.render();
    }
}