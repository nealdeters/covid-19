import { Subject } from 'rxjs';

const subject = new Subject();

const MessageService = {
	sendMessage: message => subject.next({ message: message }),
	clearMessages: () => subject.next(),
	getMessage: () => subject.asObservable()
};

export default MessageService;