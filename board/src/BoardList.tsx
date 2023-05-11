import Axios from "axios";
import { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";


import {
  Pagination,
  Container,
  Row,
  Col,
  Button,
  Nav,
  Navbar,
  Form,
  Offcanvas,
  ListGroup,
  Badge,
  Card,
  Table,
  ButtonGroup,
  Carousel,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { propTypes } from "react-bootstrap/esm/Image";

const Board = ({
  id,
  title,
  content,
  registerId,
  registerDate,
  props,
}: {
  id: number;
  title: string;
  content: string;
  registerId: string;
  registerDate: string;
  props: any;
}) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          value={id}
          onChange={(e) => {
            props.onCheckboxChange(
              e.currentTarget.checked,
              e.currentTarget.value
            );
          }}
        ></input>
      </td>
      <td>{id}</td>
      <td>{title}</td>
      <td>{content}</td>
      <td>{registerId}</td>
      <td>{registerDate}</td>
    </tr>
  );
};
interface IProps {
  isComplete: boolean;
  handleModify: any;
  renderComplete: any;
}

class BoardList extends Component<IProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      boardList: [],
      checkList: [],
    };
  }
  state = {
    boardList: [],
    checkList: [],
  };

  getList = () => {
    Axios.get("http://localhost:8000/list", {})
      .then((res) => {
        const { data } = res;
        this.setState({
          boardList: data,
        });
        this.props.renderComplete();
      })
      .catch((e) => {
        console.error(e);
      });
  };
  onCheckboxChange = (checked: boolean, id: any) => {
    const list: Array<string> = this.state.checkList.filter((v) => {
      return v != id;
    });
    if (checked) {
      list.push(id);
    }
    this.setState({
      checkList: list,
    });
  };
  handleDelete = () => {
    //글삭제 메소드
    if (this.state.checkList.length == 0) {
      alert("삭제할 게시글을 선택하세요");
      return;
    }
    let boardIdList = "";
    this.state.checkList.forEach((v: any) => {
      boardIdList += `'${v}',`;
    });
    Axios.post("http://localhost:8000/delete", {
      boardIdList: boardIdList.substring(0, boardIdList.length - 1),
    })
      .then(() => {
        this.getList();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  componentDidMount() {
    this.getList();
  }
  componentDidUpdate() {
    if (!this.props.isComplete) {
      this.getList();
    }
  }

  render() {
    const { boardList }: { boardList: any } = this.state;
    return (
      <>
      <Carousel>

      <Carousel.Item>
        <img className="d-block w-100"
        src="img/p5.jpg"
        alt="First slide"
        />
      
        <Carousel.Caption>
        <h1>스즈메의 문단속</h1>
        <p>문이 어디있는지 아니?</p>
        </Carousel.Caption>

      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100"
        src="img/p6.jpg"
        alt="Second slide"
        />
      
        <Carousel.Caption>
        <h1>너의 이름은</h1>
        <p>君の名前は</p>
        </Carousel.Caption>
        
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100"
        src="img/p7.jpg"
        alt="Second slide"
        />
      
        <Carousel.Caption>
        <h1>날씨의 아이</h1>
        <p>오늘의 날씨 : 맑음!!</p>
        </Carousel.Caption>
        
      </Carousel.Item>

      </Carousel>


      <Container>
        <Row>
          <Col>
            <h1 className="mt-3 mb-3">BBS</h1>
            <Table striped>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>번호</th>
                  <th>제목</th>
                  <th>내용</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {boardList.map((v: any) => {
                  return (
                    <Board
                      id={v.BOARD_ID}
                      title={v.BOARD_TITLE}
                      content={v.BOARD_CONTENT}
                      registerId={v.REGISTER_ID}
                      registerDate={v.REGISTER_DATE}
                      key={v.BOARD_ID}
                      props={this}
                    />
                  );
                })}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-3 mb-3">
              <ButtonGroup aria-label="Basic example">
                <Button variant="info">글쓰기</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    this.props.handleModify(this.state.checkList);
                  }}
                >
                  수정하기
                </Button>
                <Button variant="danger" onClick={this.handleDelete}>
                  삭제하기
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}
export default BoardList;
/*
수정하기 버튼 이벤트 추가
1-1. 목록의 체크박스가 선택된 상태 -> 
수정하기 버튼 클릭 시 해당 글의 상세 내용이 하단에 표시되도록 설정
1-2 목록의 체크박스가 여러 개 선택된 상태 -> 수정하기 버튼 클릭 시 경고창
1-3 목록의 체크박스가 선택되지 않은 상태 -> 수정하기 버튼 클릭 시 경고창

현재 글쓰기 모드가 수정 모드인지 신규 작성 모드인지 확인하기 위해서 
isModifyMode 상태 값을 관리해야 하는데..

현재 내 상황은
BoardList.tsx에서 수정 버튼 클릭 > Write.tsx에서 수정/신규 모드 확인
즉, BoardList에서 보낸 특정 상태 값을 Write에서 받을 수 있어야 한다.

자식 <> 부모 관계에서 props를 통해 데이터를 주고받을 수 있는 것 같아서 
아래와 같이 구현하고자 한다.

a) BoardList.tsx에서 App.tsx로 수정 버튼을 눌렀다는 이벤트 전달
b) App.tsx에 수정 버튼 클릭 이벤트가 들어오면 Write.tsx에 수정 모드로 전환
c) Write.tsx에서 글 작성이 완료되면 App.tsx에 완료 이벤트 전달
d) App.tsx에 글 작성 완료 이벤트가 들어오면 BoardList.tsx에서 목록 리 렌더링

내용 1) 부모 state 변경상태 확인을 위해 componentDidUpdate를 추가하여, 
글 작성/수정 완료 여부가 변경되면 목록을 리 렌더링 한다.

내용 2) 수정 버튼 클릭 시 현재 수정 모드임을 부모에게 전달하기 위해 
부모에게 있는 handleModify 메서드를 호출해주고, 현재 선택된 게시글을 보내주었다.
*/
