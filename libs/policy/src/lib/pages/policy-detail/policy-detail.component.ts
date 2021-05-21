import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PolicyDetail } from '../../models/policy';

@Component({
  selector: 'hcm-policy-detail',
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyDetailComponent implements OnInit {
  data: PolicyDetail = {
    title: 'Overtime & Onsite Policy',
    time: '12/Aug/20 5:31 PM',
    image: 'https://i.imgur.com/IOpoVH4.jpg',
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed sed tellus suspendisse molestie fames morbi nunc vel. Enim semper bibendum sagittis egestas vel. Lorem platea nibh diam, venenatis. Semper elit, lacus aliquam leo, ultrices malesuada nibh nisl. Nisl diam sollicitudin urna in tempor, sed. Nisi facilisis cursus neque, diam dolor risus odio commodo luctus. Lorem vestibulum aliquam ornare euismod ac. Nunc pulvinar neque dui maecenas. Tempor ac morbi tellus arcu tortor, non.',
      'Aliquet porta ut orci lacus elementum enim, cursus pretium in. Urna fermentum congue aliquam felis, ullamcorper. Lorem adipiscing sed eget nunc nulla amet. Et massa semper porttitor leo diam risus consectetur adipiscing vitae. Aliquet leo nec cursus a ullamcorper tristique neque sodales scelerisque. Sit justo, eu semper adipiscing. Fermentum enim elit porta feugiat tempor consequat sed. Sagittis vitae vel pellentesque iaculis eget sed egestas. Viverra mattis urna vitae odio eu. Tristique diam cum cras enim.',
      'Aliquam dignissim malesuada turpis nulla non et sit. Quis ut lacinia vitae pulvinar pellentesque interdum pellentesque. Leo in pellentesque quam at egestas erat ipsum iaculis sit. Felis lectus tellus risus arcu. Cras quis magna mauris sapien consectetur egestas platea faucibus ipsum. Mi egestas pharetra suspendisse lectus donec erat phasellus morbi. Aliquet sed non consectetur habitasse tellus nisi, neque adipiscing sed. Ornare nulla risus lectus lectus sed quis eu quam quam. Turpis libero rhoncus erat viverra odio nibh massa eu aliquet. Posuere arcu enim amet amet egestas. Aliquet lorem libero orci varius egestas est dui ultrices.',
      'Viverra duis mattis in sed feugiat nunc proin. Tincidunt penatibus mattis vitae vitae adipiscing imperdiet. Aliquam pellentesque feugiat lectus fringilla sit adipiscing ut. In adipiscing in sit dictumst sapien. Varius lobortis vestibulum, tristique viverra non augue. Et scelerisque elit massa et in sollicitudin gravida mattis. Vitae mattis sit duis urna turpis sed eu. Ullamcorper mauris pulvinar in porttitor etiam ultrices. Senectus velit lacus at quis aliquam molestie ullamcorper lacus. Tempor eget scelerisque praesent pretium tortor ipsum malesuada mauris dictum.',
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
