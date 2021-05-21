import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PolicyUpdated } from '../../models/policy';

@Component({
  selector: 'hcm-updated-detail',
  templateUrl: './updated-detail.component.html',
  styleUrls: ['./updated-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedDetailComponent implements OnInit {
  more = true;
  data: PolicyUpdated[] = [
    {
      title: 'Overtime & Onsite Policy',
      name: 'Nguyen Vu Hoang Cuong',
      time: '12/Aug/20 5:31 PM',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sed tellus suspendisse molestie fames morbi nunc vel. Enim semper bibendum sagittis egestas vel. Lorem platea nibh diam, venenatis. Semper elit, lacus aliquam leo, ultrices malesuada nibh nisl. Nisl diam sollicitudin urna in tempor, sed. Nisi facilisis cursus neque, diam dolor risus odio commodo luctus. Lorem vestibulum aliquam ornare euismod ac. Nunc pulvinar neque dui maecenas. Tempor ac morbi tellus arcu tortor, non.' +
        'Aliquet porta ut orci lacus elementum enim, cursus pretium in. Urna fermentum congue aliquam felis, ullamcorper. Lorem adipiscing sed eget nunc nulla amet. Et massa semper porttitor leo diam risus consectetur adipiscing vitae. Aliquet leo nec cursus a ullamcorper tristique neque sodales scelerisque. Sit justo, eu semper adipiscing. Fermentum enim elit porta feugiat tempor consequat sed. Sagittis vitae vel pellentesque iaculis eget sed egestas. Viverra mattis urna vitae odio eu. Tristique diam cum cras enim.' +
        'Aliquam dignissim malesuada turpis nulla non et sit. Quis ut lacinia vitae pulvinar pellentesque interdum pellentesque. Leo in pellentesque quam at egestas erat ipsum iaculis sit. Felis lectus tellus risus arcu. Cras quis magna mauris sapien consectetur egestas platea faucibus ipsum. Mi egestas pharetra suspendisse lectus donec erat phasellus morbi. Aliquet sed non consectetur habitasse tellus nisi, neque adipiscing sed. Ornare nulla risus lectus lectus sed quis eu quam quam. Turpis libero rhoncus erat viverra odio nibh massa eu aliquet. Posuere arcu enim amet amet egestas. Aliquet lorem libero orci varius egestas est dui ultrices.',
    },
    {
      title: 'Overtime & Onsite Policy',
      name: 'Nguyen Vu Hoang Cuong',
      time: '12/Aug/20 5:31 PM',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sed tellus suspendisse molestie fames morbi nunc vel. Enim semper bibendum sagittis egestas vel. Lorem platea nibh diam, venenatis. Semper elit, lacus aliquam leo, ultrices malesuada nibh nisl. Nisl diam sollicitudin urna in tempor, sed. Nisi facilisis cursus neque, diam dolor risus odio commodo luctus. Lorem vestibulum aliquam ornare euismod ac. Nunc pulvinar neque dui maecenas. Tempor ac morbi tellus arcu tortor, non.' +
        'Aliquet porta ut orci lacus elementum enim, cursus pretium in. Urna fermentum congue aliquam felis, ullamcorper. Lorem adipiscing sed eget nunc nulla amet. Et massa semper porttitor leo diam risus consectetur adipiscing vitae. Aliquet leo nec cursus a ullamcorper tristique neque sodales scelerisque. Sit justo, eu semper adipiscing. Fermentum enim elit porta feugiat tempor consequat sed. Sagittis vitae vel pellentesque iaculis eget sed egestas. Viverra mattis urna vitae odio eu. Tristique diam cum cras enim.' +
        'Aliquam dignissim malesuada turpis nulla non et sit. Quis ut lacinia vitae pulvinar pellentesque interdum pellentesque. Leo in pellentesque quam at egestas erat ipsum iaculis sit. Felis lectus tellus risus arcu. Cras quis magna mauris sapien consectetur egestas platea faucibus ipsum. Mi egestas pharetra suspendisse lectus donec erat phasellus morbi. Aliquet sed non consectetur habitasse tellus nisi, neque adipiscing sed. Ornare nulla risus lectus lectus sed quis eu quam quam. Turpis libero rhoncus erat viverra odio nibh massa eu aliquet. Posuere arcu enim amet amet egestas. Aliquet lorem libero orci varius egestas est dui ultrices.',
    },
    {
      title: 'Overtime & Onsite Policy',
      name: 'Nguyen Vu Hoang Cuong',
      time: '12/Aug/20 5:31 PM',
      image: 'https://i.imgur.com/IOpoVH4.jpg',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sed tellus suspendisse molestie fames morbi nunc vel. Enim semper bibendum sagittis egestas vel. Lorem platea nibh diam, venenatis. Semper elit, lacus aliquam leo, ultrices malesuada nibh nisl. Nisl diam sollicitudin urna in tempor, sed. Nisi facilisis cursus neque, diam dolor risus odio commodo luctus. Lorem vestibulum aliquam ornare euismod ac. Nunc pulvinar neque dui maecenas. Tempor ac morbi tellus arcu tortor, non.' +
        'Aliquet porta ut orci lacus elementum enim, cursus pretium in. Urna fermentum congue aliquam felis, ullamcorper. Lorem adipiscing sed eget nunc nulla amet. Et massa semper porttitor leo diam risus consectetur adipiscing vitae. Aliquet leo nec cursus a ullamcorper tristique neque sodales scelerisque. Sit justo, eu semper adipiscing. Fermentum enim elit porta feugiat tempor consequat sed. Sagittis vitae vel pellentesque iaculis eget sed egestas. Viverra mattis urna vitae odio eu. Tristique diam cum cras enim.' +
        'Aliquam dignissim malesuada turpis nulla non et sit. Quis ut lacinia vitae pulvinar pellentesque interdum pellentesque. Leo in pellentesque quam at egestas erat ipsum iaculis sit. Felis lectus tellus risus arcu. Cras quis magna mauris sapien consectetur egestas platea faucibus ipsum. Mi egestas pharetra suspendisse lectus donec erat phasellus morbi. Aliquet sed non consectetur habitasse tellus nisi, neque adipiscing sed. Ornare nulla risus lectus lectus sed quis eu quam quam. Turpis libero rhoncus erat viverra odio nibh massa eu aliquet. Posuere arcu enim amet amet egestas. Aliquet lorem libero orci varius egestas est dui ultrices.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  viewMore(): void {
    this.more = !this.more;
  }
}
